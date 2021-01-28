from django.shortcuts import render,redirect,get_object_or_404
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.contrib.auth import logout as log_out_user
from django.http import HttpResponse,HttpResponseRedirect
from django.contrib.auth.decorators import login_required
from django.db import transaction
from django.contrib.auth.hashers import make_password
from django.views.decorators.csrf import csrf_exempt
from django.contrib import messages
from user_app import impersonate
from django.contrib.sites.shortcuts import get_current_site
from django.template.loader import render_to_string
from django.core.mail import send_mail
from django.utils.html import strip_tags
from django.contrib.auth import update_session_auth_hash
from django.conf import settings
from user_app.tokens import  account_activation_token
from django.utils.encoding import force_bytes, force_text
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from user_app.models import UserProfile

# this function use for user log in 
def sign_in(request):
    if request.method == 'POST':
        #POST method when user click on submit button to pass two post parameter (Username and password)
        username = request.POST['username'] 
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)  #Django authenticate method
        
        if user is not None: #if user is exits in DB so it is redirect dashboad page
            if user.is_active:                  
                login(request, user) #Django login method
                redirect_url = '/dashboard/users_list/' if user.is_superuser else '/dashboard/users/' #if user is superuser to showing user list otherwise normal user redirect dashboard page
                return HttpResponseRedirect(redirect_url)
            else:
                user_email_status = UserProfile.objects.filter(user_id = user.id).first() #Check user email is verified if not to showing validation message and resent account activation link
                if not user_email_status.email_verified:
                    messages.error(request,"Your account is not verified <a href = '/resend_activation_email'>Verify again</a>")
                    return redirect('/')
                else: 
                    # if user is deactive by admin so it is showing this validation message
                    messages.error(request,"Your account is deactivate please contact to administrator.")
                    return redirect('/')
        else:
            messages.error(request, "Invalid username or password.") #if username or password are wrong to showing this validation message
            return redirect('/')
    else:
        #GET method it is showing login form
        return render(request,'user_app/login.html')

#this function use for logout
@login_required # First to check user are logged in or not so we check with @login_required decorater
def logout(request):
    log_out_user(request) #Django logout method
    return HttpResponseRedirect('/') #redirect login page

#this function use for new user registration
@transaction.atomic
def new_user_registrion(request):
    if request.method == 'POST':
        #POST method when user click on registration button to pass two post parameter (Username,password,first_name)
        username = request.POST['username']
        password = make_password(request.POST['password'])    
        first_name = request.POST['first_name']

        if (User.objects.filter(username = username).count()) >= 1: #To check username in already exits in DB or not 
            messages.error(request, "Email address already exits.") # if username is exits in DB to showing this validation message
            return render (request,'user_app/new_user_registration.html')

        user = User.objects.create(username = username,password = password,first_name = first_name,is_active = False) #User object create
        UserProfile.objects.create(user_id = user.id,email_verified = False) #Userprofile object create 

        send_user_mail(request,user,'Activate your account','Your email address','from email address','user_app/account_activation_email.html')
        messages.success(request,'Please check your email for verify your account.')
        return render(request,'user_app/new_user_registration.html')
    else:
        #GET method it is showing new user registration form
        return render(request,'user_app/new_user_registration.html')

#this function use for get user data
@login_required
def get_user_data(request):
    # get all user list excluse super user and pass in context
    users_data = User.objects.filter(is_superuser = False).values('id','groups__name','first_name','username','date_joined','is_active').order_by('-id')
    return render (request,"user_app/user_items.html",context = {'users_data':users_data})

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
        return redirect('/dashboard/users/') #redirect dashboard page
    else:
        #if token has expired to show this validation message
        return HttpResponse("Your link has an expired")

@login_required
#this function use for showing dashboard page
def user_dashboard(request):
    return render(request,'user_app/user_dashboard.html')

#this function use for change password
@login_required
@transaction.atomic
def update_password(request):
    if request.method == 'POST':
        # POST method when click on change password when pass two POST parameter (old_password and new_password)
        user = User.objects.filter(id = int(request.user.id)).first()
        old_password = request.POST['old_password']
        new_password = request.POST['new_password']

        if user.check_password(old_password): #Check user enter old password right or wrong
            user.set_password(request.POST['new_password']) # if enter password is right so it is update in DB
            user.save()
            if request.user.is_impersonate: #if user is impersonater or not
                messages.success(request,'Password changed sucessfully.') #if user is impersonater so it is redirect previous url
                return redirect(request.META.get('HTTP_REFERER'))
            else:
                update_session_auth_hash(request, user) #after update password to make update session 
                return redirect ('/logout')
        else:
            #if enter password is wrong when this validation message showed
            messages.error(request,"Your old password was entered incorrectly.")
            return redirect('/dashboard/update_password')
    else:
        #GET method to showing change password form
        return render(request,'user_app/change_password.html')

# this function use for delete registerd user
@csrf_exempt    
@transaction.atomic
@login_required
def delete_user(request):
    if request.method == 'POST':
        # POST method when user click on delete button when user_id pass in POST parameter
        user_id = request.POST['user_id']
        UserProfile.objects.filter(user_id = int(user_id)).delete() #delete user forignkey record in UserProfile table
        User.objects.filter(id = int(user_id)).delete() #delete user record in User table
        return HttpResponse (request,"Record deleted")
    else:
        return render (request,"user_app/delete_user_account.html")

#this function use for forget password
@transaction.atomic
def forget_password(request):
    if request.method == 'POST':
        #POST method when user click on create new password button when username pass in POST parameter
        username = request.POST['username']
        user_detail = User.objects.filter(username = username).first() #check username are exits in DB or not

        if user_detail is not None:
            #if username is exits in DB so send forget password varification link in user mail
            send_user_mail(request,user_detail,'Set your new password','Your email address','from email address','user_app/forget_password_verification.html')
            messages.success(request,'Please check your email address to create new password.') #after sent mail showing sucess message
            return redirect ('/forget_password')
        else:
            # if username is not exits in DB When showing this validation message
            messages.error(request,'Email does not exits')
            return redirect ('/forget_password')
    else:
        return render(request,'user_app/forget_password.html')

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
                return render (request,'user_app/reset_forget_password.html')
        else:
            #if token is expired so it is showing this validation message
            return HttpResponse("Your link has an expired")
    else:
        return render (request,'user_app/reset_forget_password.html')

#this function use for make user active or deactive
@transaction.atomic
@csrf_exempt
def user_active_deactive(request):
    #Pass POST paramenter (user_id) in Ajax call
    user_id = request.POST['user_id']
    user_detail = User.objects.filter(id = int(user_id)).first()
    user_detail.is_active = (not user_detail.is_active) # if user is deactive so it make active and user is active so it is make de-active 
    user_detail.save()
    return HttpResponse("active as mark sucessfully")

#this function use for start user impersonate
@login_required
def start_impersonate(request, user_id):
    #take user_id of the user to impersonate and fetch user instance and store it and also store in session so we can return them to it.
    user_detail = User.objects.filter(id = int(user_id)).first()
    impersonate.stop_impersonate(request) 
    impersonate.start_impersonate(request, user_detail)
    return redirect(settings.IMPERSONATE_REDIRECT_URL)

#this function use for stop user impersonate
@login_required
def stop_impersonate(request):
    # Remove the impersonation user from the session and return original path
    original_url = impersonate.stop_impersonate(request)
    return redirect(original_url)

#this function use for resend e-mail account verification link
@transaction.atomic
def resend_activation_email(request):
    if request.method == 'POST':
        #POST method when user click on verify maul button when username pass in POST parameter
        username = request.POST['username']
        user_detail = User.objects.filter(username = username).first() #Check username is exits in DB or not

        if user_detail is not None:  
            send_user_mail(request,user_detail,'Activate your account','Your email address','from email address','user_app/account_activation_email.html')
            messages.success(request,'Please check your email for activate your account.') #after sent mail showing this validation message
            return redirect('/resend_activation_email')
        else:
            messages.error(request,'Email does not exits.')
            return redirect('/resend_activation_email')
    else:
        #GET method to show resend_account_activation form
        return render (request,'user_app/resend_account_activation.html')

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