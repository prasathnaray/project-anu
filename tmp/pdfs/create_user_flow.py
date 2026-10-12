from reportlab.lib import colors
from reportlab.lib.pagesizes import A3, landscape
from reportlab.pdfgen import canvas
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.lib.colors import HexColor
from pathlib import Path

OUT = Path('output/pdf/project-anu-user-flow.pdf')
OUT.parent.mkdir(parents=True, exist_ok=True)

W, H = landscape(A3)
BG = HexColor('#F7FAF5')
INK = HexColor('#18313A')
MUTED = HexColor('#5D7278')
GREEN = HexColor('#8DC63F')
GREEN_DARK = HexColor('#527A1F')
PALE_GREEN = HexColor('#EAF5D8')
BLUE = HexColor('#DDF1F7')
BLUE_DARK = HexColor('#126A7B')
AMBER = HexColor('#FFF0CC')
AMBER_DARK = HexColor('#946200')
RED = HexColor('#FBE1E1')
RED_DARK = HexColor('#9A3030')
PURPLE = HexColor('#EEE4FA')
PURPLE_DARK = HexColor('#6B3FA0')
WHITE = colors.white


def wrap(text, font, size, max_width):
    words = text.split()
    lines, line = [], ''
    for word in words:
        trial = word if not line else line + ' ' + word
        if stringWidth(trial, font, size) <= max_width:
            line = trial
        else:
            if line:
                lines.append(line)
            line = word
    if line:
        lines.append(line)
    return lines


def rounded_box(c, x, y, w, h, title, body='', fill=WHITE, stroke=GREEN, title_color=INK, body_color=MUTED, radius=14, dashed=False):
    c.saveState()
    c.setLineWidth(1.6)
    c.setStrokeColor(stroke)
    c.setFillColor(fill)
    if dashed:
        c.setDash(5, 4)
    c.roundRect(x, y, w, h, radius, fill=1, stroke=1)
    c.setDash()
    c.setFillColor(title_color)
    title_size = 15
    while title_size > 10 and stringWidth(title, 'Helvetica-Bold', title_size) > w - 18:
        title_size -= 0.5
    c.setFont('Helvetica-Bold', title_size)
    c.drawCentredString(x + w/2, y + h - 25, title)
    if body:
        c.setFillColor(body_color)
        body_size = 9 if w < 160 else 10.5
        c.setFont('Helvetica', body_size)
        lines = []
        for para in body.split('\n'):
            lines += wrap(para, 'Helvetica', body_size, w - 24) or ['']
        total = len(lines) * (12 if body_size < 10 else 14)
        ty = y + (h - 36 + total) / 2 - 12
        for line in lines:
            c.drawCentredString(x + w/2, ty, line)
            ty -= (12 if body_size < 10 else 14)
    c.restoreState()


def diamond(c, cx, cy, w, h, text, fill=AMBER, stroke=AMBER_DARK):
    c.saveState()
    c.setFillColor(fill)
    c.setStrokeColor(stroke)
    c.setLineWidth(1.6)
    p = c.beginPath()
    p.moveTo(cx, cy+h/2); p.lineTo(cx+w/2, cy); p.lineTo(cx, cy-h/2); p.lineTo(cx-w/2, cy); p.close()
    c.drawPath(p, fill=1, stroke=1)
    c.setFillColor(stroke)
    c.setFont('Helvetica-Bold', 11)
    lines = wrap(text, 'Helvetica-Bold', 11, w * 0.55)
    ty = cy + 5 if len(lines) == 1 else cy + 10
    for line in lines:
        c.drawCentredString(cx, ty, line)
        ty -= 14
    c.restoreState()


def arrow(c, x1, y1, x2, y2, label=None, color=BLUE_DARK, dashed=False):
    c.saveState()
    c.setStrokeColor(color)
    c.setFillColor(color)
    c.setLineWidth(1.5)
    if dashed:
        c.setDash(5, 4)
    c.line(x1, y1, x2, y2)
    import math
    ang = math.atan2(y2-y1, x2-x1)
    size = 8
    p = c.beginPath()
    p.moveTo(x2, y2)
    p.lineTo(x2-size*math.cos(ang-0.45), y2-size*math.sin(ang-0.45))
    p.lineTo(x2-size*math.cos(ang+0.45), y2-size*math.sin(ang+0.45))
    p.close()
    c.drawPath(p, fill=1, stroke=0)
    if label:
        c.setFont('Helvetica-Bold', 9)
        c.setFillColor(color)
        c.drawCentredString((x1+x2)/2, (y1+y2)/2 + 7, label)
    c.restoreState()


def header(c, page_no, title, subtitle):
    c.setFillColor(BG); c.rect(0, 0, W, H, fill=1, stroke=0)
    c.setFillColor(GREEN); c.rect(0, H-12, W, 12, fill=1, stroke=0)
    c.setFillColor(INK); c.setFont('Helvetica-Bold', 24); c.drawString(52, H-62, title)
    c.setFillColor(MUTED); c.setFont('Helvetica', 11); c.drawString(52, H-82, subtitle)
    c.setFillColor(MUTED); c.setFont('Helvetica', 9); c.drawRightString(W-52, 28, f'Project Anu | User flow | {page_no}')


def legend(c, x, y):
    items = [(GREEN, 'Screen / destination'), (AMBER, 'Decision'), (BLUE, 'System / session'), (RED, 'Error / exit')]
    c.setFont('Helvetica', 9)
    for i, (col, label) in enumerate(items):
        xx = x + i*140
        c.setFillColor(col); c.roundRect(xx, y, 14, 14, 3, fill=1, stroke=0)
        c.setFillColor(MUTED); c.drawString(xx+20, y+3, label)


def page_auth(c):
    header(c, 1, 'Project Anu - End-to-end user flow', 'Authentication, session protection, role resolution, and entry into the workspace')
    legend(c, 52, H-120)
    # main spine
    y = H-260
    rounded_box(c, 40, y, 125, 74, 'Start', 'User opens the app', fill=PALE_GREEN, stroke=GREEN_DARK)
    rounded_box(c, 190, y, 145, 74, 'Login', 'Email + password\nShow / hide', fill=WHITE, stroke=GREEN)
    diamond(c, 425, y+37, 145, 92, 'Credentials valid?')
    rounded_box(c, 505, y, 145, 74, 'Auth API', 'Issue token\nStore session', fill=BLUE, stroke=BLUE_DARK)
    diamond(c, 740, y+37, 145, 92, 'Verified?')
    rounded_box(c, 820, y, 155, 74, 'Route gate', 'Validate JWT\nRefresh if needed', fill=BLUE, stroke=BLUE_DARK)
    rounded_box(c, 1015, y, 135, 74, 'Dashboard', 'Render by role', fill=PALE_GREEN, stroke=GREEN_DARK)
    arrow(c, 165, y+37, 190, y+37)
    arrow(c, 335, y+37, 353, y+37)
    arrow(c, 497, y+37, 505, y+37, 'yes')
    arrow(c, 650, y+37, 667, y+37)
    arrow(c, 812, y+37, 820, y+37, 'yes')
    arrow(c, 975, y+37, 1015, y+37)
    # branches
    rounded_box(c, 353, y-155, 145, 70, 'Login error', 'Show toast\nStay on Login', fill=RED, stroke=RED_DARK, title_color=RED_DARK)
    arrow(c, 425, y-11, 425, y-85, 'no', RED_DARK)
    rounded_box(c, 667, y-155, 145, 70, 'Verify account', 'Request OTP\nSubmit OTP', fill=AMBER, stroke=AMBER_DARK, title_color=AMBER_DARK)
    arrow(c, 740, y-11, 740, y-85, 'no', AMBER_DARK)
    rounded_box(c, 190, y-155, 145, 70, 'Forgot password', 'Reset modal\nNew password', fill=PURPLE, stroke=PURPLE_DARK, title_color=PURPLE_DARK)
    arrow(c, 262, y, 262, y-85, 'optional', PURPLE_DARK, dashed=True)
    rounded_box(c, 820, y-155, 155, 70, 'Session revoked', 'Clear session\nReturn to Login', fill=RED, stroke=RED_DARK, title_color=RED_DARK)
    arrow(c, 897, y, 897, y-85, 'fail', RED_DARK, dashed=True)
    rounded_box(c, 1015, y-155, 135, 70, 'Role denied', 'Redirect to\nDashboard', fill=RED, stroke=RED_DARK, title_color=RED_DARK)
    arrow(c, 1082, y, 1082, y-85, 'denied', RED_DARK, dashed=True)
    # notes
    c.setFillColor(INK); c.setFont('Helvetica-Bold', 13); c.drawString(70, 230, 'Guardrails implemented in the code')
    c.setFillColor(MUTED); c.setFont('Helvetica', 10.5)
    notes = ['PrivateRoute checks localStorage user_token before rendering protected pages.', 'JWT sid and expiry are validated; expired tokens attempt refresh-token before logout.', 'A session heartbeat validates the active session every 10 seconds and on window focus.', 'Socket session:revoked events force local-session cleanup and return the user to Login.']
    for i, n in enumerate(notes):
        c.drawString(84, 205-i*18, u'• ' + n)


def page_roles(c):
    header(c, 2, 'Role-based workspace navigation', 'The dashboard component and sidebar expose different destinations for each role')
    legend(c, 52, H-120)
    rounded_box(c, 40, H-255, 170, 78, 'Dashboard', 'Decode JWT role\nRender home screen', fill=PALE_GREEN, stroke=GREEN_DARK)
    roles = [
        ('99  Super Admin', 'SuperAdminDashboard', ['Curriculum / Academics', 'Certificates / Courses', 'Course Mapping', 'Reatt Data', 'Volume Management', 'Custom Course', 'Content Access', 'Reports'], PURPLE, PURPLE_DARK),
        ('101  Admin', 'AdminDashboard', ['Batches', 'Instructors', 'Trainees', 'Schedules', 'Certificates / Courses', 'VR Space / Streams', 'Volume Management', 'Reports', 'Custom Course'], BLUE, BLUE_DARK),
        ('102  Instructor', 'TutorDashboard', ['Dashboard', 'Batches', 'Trainees', 'Certificates / Courses', 'Reports', 'Volume Management'], AMBER, AMBER_DARK),
        ('103  Learner', 'TraineeDashboard', ['My Learning', 'Schedules', 'Queries', 'Batch', 'VR Space / Streams'], PALE_GREEN, GREEN_DARK),
    ]
    x_positions = [245, 485, 725, 965]
    for (name, comp, items, fill, stroke), x in zip(roles, x_positions):
        rounded_box(c, x, H-270, 205, 105, name, comp, fill=fill, stroke=stroke, title_color=stroke)
        arrow(c, 210, H-216, x, H-216, color=stroke)
        box_y = H-575
        c.setFillColor(fill); c.setStrokeColor(stroke); c.setLineWidth(1.3); c.roundRect(x, box_y, 205, 235, 14, fill=1, stroke=1)
        c.setFillColor(stroke); c.setFont('Helvetica-Bold', 12); c.drawCentredString(x+102, box_y+210, 'Available navigation')
        c.setFillColor(INK); c.setFont('Helvetica', 11)
        for i, item in enumerate(items):
            c.setFillColor(stroke); c.circle(x+25, box_y+180-i*22, 3, fill=1, stroke=0)
            c.setFillColor(INK); c.setFont('Helvetica', 9.5); c.drawString(x+38, box_y+176-i*22, item)
        arrow(c, x+102, H-165, x+102, box_y+235, color=stroke)
    c.setFillColor(MUTED); c.setFont('Helvetica', 10)
    c.drawString(70, 160, 'Common shell actions: sidebar navigation, notifications, profile modal, schedules/sessions, and logout.')
    c.drawString(70, 142, 'Access control is enforced both by explicit allowedRoles wrappers and by route-prefix role rules in ProtectedRoutes.')


def page_learning(c):
    header(c, 3, 'Learner learning journey', 'Primary learner path from assigned course to module activities, progress, and completion')
    legend(c, 52, H-120)
    y = H-270
    xs = [35, 200, 365, 530, 695, 860, 1025]
    boxes = [
        ('Assigned Courses', 'Open /course-access\n(or My Learning)', PALE_GREEN, GREEN_DARK),
        ('Certificate / Course', 'Choose BTC, UFC, or\nassigned curriculum', BLUE, BLUE_DARK),
        ('Chapter', 'Open /chapters/:course_id\nSelect a chapter', AMBER, AMBER_DARK),
        ('Module', 'Open /module/:chapter_id/:course_id\nReview module content', PURPLE, PURPLE_DARK),
        ('Resources', 'Open /resource/:module_id\nFilter learning items', PALE_GREEN, GREEN_DARK),
        ('Activity', 'Resource, practice,\nimage interpretation, or test', BLUE, BLUE_DARK),
        ('Progress', 'Update completion\nReturn to My Progress', PALE_GREEN, GREEN_DARK),
    ]
    for i, (title, body, fill, stroke) in enumerate(boxes):
        rounded_box(c, xs[i], y, 130, 86, title, body, fill=fill, stroke=stroke, title_color=stroke)
        if i < len(boxes)-1:
            arrow(c, xs[i]+130, y+43, xs[i+1], y+43, color=stroke)
    # activity detail branch
    rounded_box(c, 365, y-200, 190, 76, 'Practice / interpret', 'Submit interaction\nRecord attempt + score', fill=AMBER, stroke=AMBER_DARK, title_color=AMBER_DARK)
    rounded_box(c, 585, y-200, 190, 76, 'Test result', 'Pass / retry\nReattempts available', fill=PURPLE, stroke=PURPLE_DARK, title_color=PURPLE_DARK)
    diamond(c, 870, y-162, 150, 88, 'Complete?')
    rounded_box(c, 955, y-200, 195, 76, 'Next item / module', 'Continue sequence or\nreturn to list', fill=PALE_GREEN, stroke=GREEN_DARK, title_color=GREEN_DARK)
    arrow(c, 430, y, 460, y-124, color=AMBER_DARK)
    arrow(c, 555, y-162, 585, y-162, color=AMBER_DARK)
    arrow(c, 775, y-162, 795, y-162, color=PURPLE_DARK)
    arrow(c, 945, y-162, 955, y-162, 'yes', GREEN_DARK)
    arrow(c, 870, y-206, 870, y-235, 'no / retry', RED_DARK, dashed=True)
    rounded_box(c, 740, y-300, 260, 65, 'Retry / feedback', 'Show result and allow\nreattempt where supported', fill=RED, stroke=RED_DARK, title_color=RED_DARK)
    arrow(c, 740, y-267, 585, y-200, 'retry', RED_DARK, dashed=True)
    # supporting loop
    rounded_box(c, 40, 175, 330, 95, 'Supporting destinations', 'Schedules | Queries | Batch | Streams / VR Space\nAccessible from the learner sidebar', fill=BLUE, stroke=BLUE_DARK, title_color=BLUE_DARK)
    rounded_box(c, 430, 175, 330, 95, 'Instructor / admin oversight', 'Dashboard metrics, reports, trainee profiles,\ncourse assignment, volume and content management', fill=PURPLE, stroke=PURPLE_DARK, title_color=PURPLE_DARK)
    rounded_box(c, 820, 175, 330, 95, 'Completion loop', 'Resource completion and interaction attempts\nfeed dashboard progress and reporting', fill=PALE_GREEN, stroke=GREEN_DARK, title_color=GREEN_DARK)
    arrow(c, 370, 222, 430, 222, color=BLUE_DARK)
    arrow(c, 760, 222, 820, 222, color=PURPLE_DARK)
    c.setFillColor(MUTED); c.setFont('Helvetica', 10)
    c.drawString(90, 130, 'Implemented routes referenced by this journey: /course-access, /my-learning, /cert-course/:certificate_id, /chapters/:course_id, /module/:chapter_id/:course_id, /resource/:module_id, /my-progress.')


def build():
    c = canvas.Canvas(str(OUT), pagesize=landscape(A3))
    c.setTitle('Project Anu User Flow')
    c.setAuthor('Codex')
    page_auth(c); c.showPage()
    page_roles(c); c.showPage()
    page_learning(c); c.showPage()
    c.save()
    print(OUT.resolve())


if __name__ == '__main__':
    build()
