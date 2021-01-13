from django import template
register = template.Library()

@register.filter
def get_last_child(node):
    if node:
        return (list(node)[-1]).message
    else:
        return ""
