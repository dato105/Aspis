import logging

from django.conf import settings
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail


def send_email(from_email, to_emails, subject, html_content):
    message = Mail(from_email=from_email, to_emails=to_emails, subject=subject, html_content=html_content)
    try:
        sg = SendGridAPIClient(settings.SENDGRID_API_KEY)
        response = sg.send(message)
        logging.info(
            f'Sent email from {from_email} to {to_emails} with subject {subject} and content {html_content}.'
            f' Got response with status {response.status_code}'
        )
    except Exception as e:
        print(e.to_dict)
        logging.error(msg=f'Got exception while sending an email', exc_info=e)
