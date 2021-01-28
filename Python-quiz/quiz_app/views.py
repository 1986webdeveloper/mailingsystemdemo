from django.shortcuts import render,redirect
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.contrib.auth import logout as log_out_user
from django.http import HttpResponse,HttpResponseRedirect
from django.contrib.auth.decorators import login_required
from django.db import transaction
from django.contrib.auth.hashers import make_password
from django.views.decorators.csrf import csrf_exempt
from django.contrib import messages
from quiz_app.models import Quiz,Question,Choice,Answer,Userquizreletion,UsersAnswer,UserProfile
from next_prev import next_in_order
from django.urls import reverse
from django.contrib.sites.shortcuts import get_current_site
from django.template.loader import render_to_string
from django.core.mail import send_mail
from django.utils.html import strip_tags
from quiz_app.tokens import  account_activation_token
from django.utils.encoding import force_bytes, force_text
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode

#this function use for user login
def sigin(request):
    if request.method == 'POST':
        #POST method when user click on submit button to pass two post parameter (Username and password)
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)  #Django authenticate method
        
        if user is not None: #if user is exits in DB so it is redirect dashboad page
            if user.is_active:
                login(request, user) #Django login method
                return HttpResponseRedirect('/quiz_app/user_dashboard/')
            else:
                user_email_status = UserProfile.objects.filter(user_id = user.id).first() #Check user email is verified if not to showing validation message and resent account activation link
                if not user_email_status.email_verified:
                    messages.error(request,"Your account is not verified <a href = '/resend_activation_email'>Verify again</a>")
                    return redirect('/')
        else:
            messages.error(request, "Invalid username or password")  #if username or password are wrong to showing this validation message
            return HttpResponseRedirect('/')
    else:
        #GET method it is showing login form
        return render(request,'quiz_app/login.html')

#this function use for logout
@login_required # First to check user are logged in or not so we check with @login_required decorater
def logout(request):
    log_out_user(request) #Django logout method
    return HttpResponseRedirect('/') #redirect login page

#this function use for new user registration
@transaction.atomic
def new_user_registration(request): 
    if request.method == 'POST':
        #POST method when user click on registration button to pass two post parameter (Username,password,first_name)

        username = request.POST['username']
        password = make_password(request.POST['password'])
        first_name = request.POST['first_name']

        if (User.objects.filter(username = username).count()) >= 1: #To check username in already exits in DB or not
            messages.error(request, "Email address already exits.") # if username is exits in DB to showing this validation message
            return HttpResponseRedirect('/new_user_registration')   
        
        user = User.objects.create(username = username,password = password,first_name = first_name,is_active = False) #User object create
        UserProfile.objects.create(user_id = user.id,email_verified = False) #Userprofile object create 
        
        send_user_mail(request,user,'Activate your account','Your mail address','to mail address','quiz_app/account_activation_email.html')
        
        messages.success(request,'Please check your email for verify your account.')
        return HttpResponseRedirect('/new_user_registration') 
        
    else:
        #GET method it is showing new user registration form
        return render(request,'quiz_app/new_user_registration.html')

#this function use for forget password
@transaction.atomic
def forget_password(request):
    if request.method == 'POST':
        #POST method when user click on create new password button when username pass in POST parameter
        username = request.POST['username']
        user_detail = User.objects.filter(username = username).first() #check username are exits in DB or not

        if user_detail is not None:
            #if username is exits in DB so send forget password varification link in user mail
            send_user_mail(request,user_detail,'Set your new password','Your mail address','to mail address','quiz_app/forget_password_verification.html')
            messages.success(request,'Please check your email address to create new password.') #after sent mail showing sucess message
            return redirect ('/forget_password')
        else:
            # if username is not exits in DB When showing this validation message
            messages.error(request,'Email does not exits')
            return redirect ('/forget_password')
    else:
        return render(request,'quiz_app/forget_password.html')

#this function use for create new password for which user are forget password
@transaction.atomic
def reset_password(request,uidb64,token):
    if request.method == 'POST':
        #POST method when user click on save password when pass two POST parameter (new_password,confirm_password)
        #Also pass user_id and token by url
        user_id = force_text(urlsafe_base64_decode(uidb64))
        new_password = request.POST['new_password']
        confirm_password = request.POST['confirmation_password']
        
        user_detail = User.objects.filter(id = int(user_id)).first() #check user is exits or not in DB
    
        if account_activation_token.check_token(user_detail, token): #check token is expire or not (this is one time link)
            if new_password == confirm_password: #if both password are same so it is update new password in DB
                user_detail.set_password(request.POST['new_password'])
                user_detail.save()
                return redirect ('/')
            else:
                #if password are not match so it is showing this validation message
                messages.error(request,'Password are should not match.')
                return render (request,'quiz_app/reset_forget_password.html')
        else:
            #if token is expired so it is showing this validation message
            return HttpResponse("Your link has an expired")
    else:
        return render (request,'quiz_app/reset_forget_password.html')

#this function use for resend e-mail account verification link
@transaction.atomic
def resend_activation_email(request):
    if request.method == 'POST':
        #POST method when user click on verify maul button when username pass in POST parameter
        username = request.POST['username']
        user_detail = User.objects.filter(username = username).first() #Check username is exits in DB or not

        if user_detail is not None:  
            send_user_mail(request,user_detail,'Activate your account','Your mail address','to mail address','quiz_app/account_activation_email.html')
            messages.success(request,'Please check your email for activate your account.') #after sent mail showing this validation message
            return redirect('/resend_activation_email')
        else:
            messages.error(request,'Email does not exits.')
            return redirect('/resend_activation_email')
    else:
        #GET method to show resend_account_activation form
        return render (request,'quiz_app/resend_account_activation.html')


#this function use for user activation 
def activate_accout(request,uidb64,token):
    # there is pass userid(base64) and token in Url
    user_id = force_text(urlsafe_base64_decode(uidb64)) #decode user id
    user = User.objects.filter(id = int(user_id)).first() #Check user is exits or not
    
    if user is not None and account_activation_token.check_token(user, token): #Check user activation link token has an expired or not
        user.is_active = True
        user.save()
        UserProfile.objects.filter(user_id = user.id).update(email_verified = True) #email verified entry in table
        login(request, user) 
        return redirect('/quiz_app/user_dashboard/') #redirect dashboard page
    else:
        #if token has expired to show this validation message
        return HttpResponse("Your link has an expired")

#this function use for showing dashboard
@login_required
def user_dashboard(request):
    question_slug = Question.objects.values('slug').first()
    return render(request,'quiz_app/dashboard.html',context = {'question_slug':question_slug['slug']})

#this function use for add question and showing add question form 
@login_required
@transaction.atomic
def add_question(request):
    if request.method == 'POST':
        #POST method when user click on save question button to pass 4 Post parameter(question,quiz_id,answer,options)
        choices = []
        question = request.POST['question']
        quiz_id = int(request.POST['quiz_id'])
        answer = request.POST['answer']
        choices.extend((request.POST['option_1'],request.POST['option_2'],request.POST['option_3'],request.POST['option_4']))
        question = Question.objects.create(quiz_id = quiz_id,name = question) #Question object create

        for choice in choices: #multiple choice object create
            Choice.objects.create(choice = choice,question_id = question.id)
        
        Answer.objects.create(text = answer,question_id = question.id) #Answer object create
        messages.success(request,'Question is added') # After question created to showing this message
        return redirect('/quiz_app/add_question/')

    else:
        #GET method to show add question form
        quiz_types = Quiz.objects.all() #get all quiz type and send question html
        return render(request,'quiz_app/add_question.html',context = {'quiz_types':quiz_types})

#this function use for showing all question,quiz and answer
@login_required
def get_all_question(request):
    questions = Question.objects.all()
    return render(request,'quiz_app/questions.html',context = {'questions':questions})

#this function use for start quiz
@login_required
def start_quiz(request,question_slug):
    #there is pass question_slug in question_slug
    question = Question.objects.filter(slug = question_slug).first() #getting question from slug
    choices_data = Choice.objects.filter(question_id = question.id)
    next_slug = next_in_order(question) #getting next slug use next_in_order method

    if Userquizreletion.objects.filter(user_id = request.user.id, quiz_id = question.quiz_id).count() == 0: #check logged user is exit in db or not
        user_quiz_data = Userquizreletion.objects.create(user_id = request.user.id, quiz_id = question.quiz_id)  #create user_quiz_reletion object
    else:
        user_quiz_data = Userquizreletion.objects.filter(user_id = request.user.id, quiz_id = question.quiz_id).first() #it is already created so get reletion data
    return render(request,'quiz_app/start_quiz.html',context = {'question':question,'choices_data':choices_data,'next_slug':next_slug.slug if next_slug else '','user_quiz_data':user_quiz_data.id})
 
#this function use for exit quiz game    
@login_required
@transaction.atomic
def exit_quiz(request): # remove logged user data
    Userquizreletion.objects.filter(user_id = request.user.id).delete()
    return redirect('/quiz_app/user_dashboard/')

#this function use for showing quiz score and wrong answer and right answer
@login_required
def quiz_score(request):
    user_quiz_relation_id = Userquizreletion.objects.filter(user_id = request.user.id).first() #get user quiz data 
    user_answer_data = UsersAnswer.objects.filter(quiz_taker_id = user_quiz_relation_id) #get user quiz answer data
    score_data = []
    total_score = 0
    user_score = 0

    for user_data in user_answer_data:
        user_answer = user_data.choice.choice # this is user answer
        right_answer = user_data.question.answer_choice_to_string(user_data.question_id) #this is a right answer
        total_score += 1 

        if user_answer == right_answer: #check both answer are same or not if same add score 10 otherwise add 0
            user_score += 10

        score_data.append({'question':user_data.question.name,'user_answer':user_answer,'right_answer':right_answer})  #apped all score data and pass in html
        # if wrong answer is showing red line and right answer is showing green line
    return render(request,'quiz_app/quiz_score.html',context = {'score_data':score_data,'user_score':user_score,'total_score':total_score * 10})

#this function use for save user answer
@login_required     
@transaction.atomic
def save_user_answer(request):
    #POST parameter (question_id,answer,user_quiz_relation_id)
    question_id = int(request.POST['question_id'])
    choice = request.POST['choice']
    user_quiz_relation_id = int(request.POST['user_quiz_relation_id'])
    choice_data = Choice.objects.filter(choice =choice,question_id = question_id).values('id').first()  #get choice answer text
    question = Question.objects.filter(id = question_id).first()
    next_slug = next_in_order(question) # next_in_order use for getting next question 
    UsersAnswer.objects.create(question_id = question_id,quiz_taker_id = user_quiz_relation_id,choice_id = choice_data['id']) #useranswer object create

    if not next_slug: #Check question is not last if question is last to redirect score board page
        return HttpResponseRedirect(reverse('score_board'))
    
    #if question is not last to redirect next question
    return HttpResponseRedirect(reverse(('start_quiz'),kwargs={'question_slug': next_slug.slug}))


#this function use for sent mail to activation and forget password (this is common function for send mail)
@transaction.atomic
def send_user_mail(request,user_detail,subject,from_mail,to_mail,template_name):
    
    #pass user_detail in template context data
    html_message = render_to_string(template_name, {
        'user': user_detail,
        'domain': get_current_site(request).domain,
        'uid': urlsafe_base64_encode(force_bytes(user_detail.id)),
        'token':account_activation_token.make_token(user_detail)
    })
    #Django default mail function (You have to pass mail credential in Settings.py)
    send_mail(subject, strip_tags(html_message), from_mail , [to_mail], html_message=html_message)
    return ('Mail sent')