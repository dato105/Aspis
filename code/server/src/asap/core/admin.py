from django.contrib import admin

from core.models import Application, Version, Profile, Rank, Department, Alert, Recommendation, \
    Document, CommitteeCandidate, Recommend, Committee, ApplicationStep

admin.site.register(Version)
admin.site.register(Profile)
admin.site.register(Application)
admin.site.register(Rank)
admin.site.register(Department)

admin.site.register(Alert)
admin.site.register(Recommendation)
admin.site.register(Document)
admin.site.register(CommitteeCandidate)
admin.site.register(Recommend)
admin.site.register(Committee)
admin.site.register(ApplicationStep)
