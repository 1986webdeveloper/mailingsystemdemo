from django import template
register = template.Library()
from quiz_app.models import Answer

@register.filter
def get_answer(question_id):
	return Answer.objects.get(question_id = question_id).text
