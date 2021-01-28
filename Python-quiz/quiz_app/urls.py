from django.conf.urls import url
from quiz_app import views

urlpatterns = [
   url(r'^$' ,views.sigin,name='sigin'),
   url(r'^logout/$' ,views.logout,name='logout'),
   url(r'^new_user_registration/$' ,views.new_user_registration,name='new_user_registration'),
   url(r'^quiz_app/user_dashboard/$' ,views.user_dashboard,name='user_dashboard'), 
   url(r'^quiz_app/add_question/$' ,views.add_question,name='add_question'), 
   url(r'^quiz_app/all_question/$' ,views.get_all_question,name='all_question'), 
   url(r'^quiz_app/quiz/(?P<question_slug>[\w-]+)/$' ,views.start_quiz,name='start_quiz'), 
   url(r'^exit_quiz/$' ,views.exit_quiz,name='exit_quiz'),
   url(r'^quiz_app/score_board/$' ,views.quiz_score,name='score_board'),
   url(r'^save_user_answer/$' ,views.save_user_answer,name='save_user_answer'),
   url(r'^forget_password/$', views.forget_password, name='forget_password'),
   url(r'^reset_password/(?P<uidb64>[0-9A-Za-z]+)/(?P<token>.+)/$', views.reset_password, name='reset_forget_password'),
   url(r'^resend_activation_email/$', views.resend_activation_email, name='resend_activation_email'),
   url(r'^activate/(?P<uidb64>[0-9A-Za-z]+)/(?P<token>.+)$',views.activate_accout,name='activate'),
]