from django.conf import settings
from django.dispatch import Signal

# signal sent when an impersonation session begins
session_begin = Signal(providing_args=['impersonator', 'impersonating', 'request'])
# signal sent when an impersonation session ends
session_end = Signal(providing_args=['impersonator', 'impersonating', 'request'])

#this function use for start user impersonate
def start_impersonate(request, new_user):
    request.session['_impersonate'] = new_user.id #store impersonating user id in session
    prev_path_url = request.META.get('HTTP_REFERER') #to get previous path url
    
    if prev_path_url:
        request.session['_impersonate_prev_path'] = request.build_absolute_uri(prev_path_url) #store previous path url in session

    # impersonator is login user (means it is already in session it id access impersonating user) and impersonating means that impersonator access a property
    session_begin.send(sender=None,impersonator=request.user,impersonating=new_user,request=request) 

#this function use for stop user impersonate
def stop_impersonate(request):
    if '_impersonate' in request.session:           
        request.user.is_impersonate = False 
        request.user = request.impersonator                
        # now _impersonate user become a impersonating and impersonating user become impersonator
        # get impersonate value in session
        impersonating = request.session.pop('_impersonate', None)
        session_end.send(sender=None,impersonator=request.impersonator,impersonating=impersonating,request=request)

    #get a _impersonate_prev_path in session when we store in start_impersonate and redirect original path
    original_path = request.session.pop('_impersonate_prev_path', None)        
    return original_path