from django.shortcuts import render
from django.shortcuts import render,redirect
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.contrib.auth import logout as log_out_user
from django.http import HttpResponse,HttpResponseRedirect
from django.contrib.auth.decorators import login_required
from mail_app.models import Message
from django.db import transaction
from datetime import datetime
from django.contrib.auth.hashers import make_password
from django.views.decorators.csrf import csrf_exempt
from django.contrib import messages

def index(request):
    # this function use for shown login form 
    if 'user' in request.session:   #if user has in session to redirect dashboard page
        return HttpResponseRedirect('/dashboard/inbox_messages/')
    return render(request,'mail_app/login.html') #render login form

def sigin(request): 
    # When user click submit button pass to post parameter like username and password and it is check with authenticate method 
    #if user is exit so direct dashboard page otherwise show validation message
    username = request.POST['username']
    password = request.POST['password']
    user = authenticate(request, username=username, password=password)   #check username and password with authenticate method

    if user is not None:
        login(request, user) #django login method
        request.session['user'] = user.username   # save username in session
        if user.is_active:
            return HttpResponseRedirect('/dashboard/inbox_messages/')  # if user has active after than redirect dashboard page
    else:
        messages.error(request, "Invalid username or password")
        return render(request,'mail_app/login.html')

@login_required
def logout(request):
    # When user click on logout button so it is redirect login page
    log_out_user(request) #django logout method 
    return HttpResponseRedirect('/')

def new_user_registrion(request):  #for new user registration
    # when user click on Create an account showing new registration form
    return render(request,'mail_app/new_user_registration.html')

@transaction.atomic
def save_new_user(request):  #save a new user
    # When we click on Registration button when we pass three post parameter username,password,full_name and create new record 
    username = request.POST['username']
    password = make_password(request.POST['password'])  # for password use make_password method.    
    first_name = request.POST['first_name']

    if (User.objects.filter(username = username).count()) >= 1: #check a username in already exits in table or not
        messages.error(request, "Email address already exits.")
        return render (request,'mail_app/new_user_registration.html')

    user = User.objects.create(username = username,password = password,first_name = first_name)  #Create new user record
    login(request, user)
    return HttpResponseRedirect('/dashboard/inbox_messages') #after registration redirect login page
    
@transaction.atomic()
def compose_email(request): #for a mail compose
    # this function are use for compose mail and there are two method post and get if request is post so it is create new message
    #if request is get shown compose form and we have to passed registerd user in compose form

    if request.method == 'POST':
        #post method (parameter - message,subject,to_user_id)
        message = request.POST['message']
        subject = request.POST['subject']
        to_user_id = request.POST['to_user_id']
        Message.objects.create(subject = subject,message = message,to_user_id = to_user_id,from_user_id = request.user.id) #create new message record
        return HttpResponseRedirect('/dashboard/sent_messages/') #after sucess it is redirect in sent items
    else:
        #get method 
        users = User.objects.filter(is_active = True).exclude(id = request.user.id).values('id','username')  #pass a registerd user in html
        return render(request,'mail_app/compose.html',context = {'users':users,'user_email':request.user.username})

@login_required  #first to check user is login or not so we have use (@login_required) decorater
def inbox_messages(request):
    #This function use to get login user message data and pass in template
    print(request.user.id,"request.user.id")
    inbox_message_data = Message.objects.filter(to_user_id=request.user.id).order_by('-id').distinct('subject','id')
    return render(request,'mail_app/inbox_items.html',context = {'inbox_message_data':inbox_message_data}) 

@login_required #first to check user is login or not so we have use (@login_required) decorater
def sent_messages(request):
    #This function are use to get messages which login user has sent to onther user and pass messages in template
    sent_message_data = Message.objects.filter(from_user_id=request.user.id).order_by('-id').distinct('subject','id')
    return render(request,'mail_app/send_messages.html',context = {'sent_message_data':sent_message_data})

@transaction.atomic()
def message_detail(request,message_id):
    # this function use for get message details and message reply
    # there is two request Post and Get method   
    message_data = Message.objects.filter(id = int(message_id))  # get a details of the message

    if request.method == 'POST':
        message = request.POST['message']
        subject = request.POST['subject']
        to_user_id =request.POST['to_user_id']
        Message.objects.create(subject = subject,message = message,parent_id = message_id,to_user_id = to_user_id,from_user_id = request.user.id) #New message create
        return HttpResponseRedirect('/dashboard/sent_messages/')
    else:
        Message.objects.filter(id = int(message_id)).update(has_readed = True)
        return render(request,'mail_app/message_detail.html',context = {'message_data':message_data})

@csrf_exempt
def mark_as_read_or_unread(request):
    #this function use for message are read or unread
    #pass message_id in ajax post data 
    message_id = request.POST['message_id'] 
    message_data = Message.objects.filter(id = int(message_id)).first()
    # if message is readed mode so it is update unread mode and if message is unread mode so it is update read mode
    message_data.has_readed = (not message_data.has_readed) 
    message_data.save()
    return HttpResponse("message as mark suceesfully")

