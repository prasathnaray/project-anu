from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A3, landscape
from reportlab.pdfgen import canvas
from reportlab.pdfbase.pdfmetrics import stringWidth

OUT = Path('output/pdf/project-anu-complete-centralized-flowchart.pdf')
OUT.parent.mkdir(parents=True, exist_ok=True)
W, H = landscape(A3)

BG = HexColor('#F7FAFC')
INK = HexColor('#19323C')
MUTED = HexColor('#587078')
GREEN = HexColor('#DFF2D0')
GREEN_D = HexColor('#4A7C2C')
BLUE = HexColor('#DCEFF7')
BLUE_D = HexColor('#17657A')
PURPLE = HexColor('#EAE1F7')
PURPLE_D = HexColor('#684394')
AMBER = HexColor('#FFF0CE')
AMBER_D = HexColor('#9A6500')
RED = HexColor('#F9DFDF')
RED_D = HexColor('#9A3030')
WHITE = colors.white


def wrap(text, font, size, width):
    lines = []
    for para in text.split('\n'):
        words = para.split()
        line = ''
        for word in words:
            trial = word if not line else line + ' ' + word
            if stringWidth(trial, font, size) <= width:
                line = trial
            else:
                if line:
                    lines.append(line)
                line = word
        if line:
            lines.append(line)
    return lines


def box(c, x, y, w, h, title, body='', fill=WHITE, stroke=BLUE_D, title_color=INK, fs=11):
    c.saveState()
    c.setFillColor(fill); c.setStrokeColor(stroke); c.setLineWidth(1.5)
    c.roundRect(x, y, w, h, 12, fill=1, stroke=1)
    c.setFillColor(title_color); c.setFont('Helvetica-Bold', fs)
    c.drawCentredString(x + w / 2, y + h - 20, title)
    if body:
        size = 8.5 if w < 190 else 9.5
        c.setFont('Helvetica', size); c.setFillColor(INK)
        lines = wrap(body, 'Helvetica', size, w - 20)
        leading = 11
        top = y + h - 38
        for i, line in enumerate(lines[:max(1, int((h - 42) / leading))]):
            c.drawCentredString(x + w / 2, top - i * leading, line)
    c.restoreState()


def arrow(c, x1, y1, x2, y2, label='', color=BLUE_D, dashed=False):
    import math
    c.saveState(); c.setStrokeColor(color); c.setFillColor(color); c.setLineWidth(1.4)
    if dashed: c.setDash(5, 4)
    c.line(x1, y1, x2, y2); ang = math.atan2(y2-y1, x2-x1); s = 7
    p = c.beginPath(); p.moveTo(x2, y2)
    p.lineTo(x2-s*math.cos(ang-.45), y2-s*math.sin(ang-.45))
    p.lineTo(x2-s*math.cos(ang+.45), y2-s*math.sin(ang+.45)); p.close()
    c.drawPath(p, fill=1, stroke=0)
    if label:
        c.setDash(); c.setFont('Helvetica-Bold', 8); c.drawCentredString((x1+x2)/2, (y1+y2)/2+5, label)
    c.restoreState()


def header(c, n, title, subtitle):
    c.setFillColor(BG); c.rect(0, 0, W, H, fill=1, stroke=0)
    c.setFillColor(GREEN_D); c.rect(0, H-12, W, 12, fill=1, stroke=0)
    c.setFillColor(INK); c.setFont('Helvetica-Bold', 24); c.drawString(42, H-58, title)
    c.setFillColor(MUTED); c.setFont('Helvetica', 11); c.drawString(42, H-78, subtitle)
    c.setFont('Helvetica', 9); c.drawRightString(W-42, 26, f'Project ANU | Technical flowchart | {n}')


def page_central(c):
    header(c, 1, 'Project ANU - Centralized technical architecture', 'All roles use the same secured platform services and persistence layers')
    layers = [
        ('Users and devices', [('Super Admin', PURPLE), ('Institution Admin', BLUE), ('Instructor', AMBER), ('Trainee / VR headset', GREEN)]),
        ('Application gateway', [('React web portal', BLUE), ('VR client', GREEN), ('HTTPS REST API', BLUE), ('Socket.IO events', PURPLE), ('Amazon IVS stream', AMBER)]),
        ('Backend services', [('Auth + JWT + RBAC', PURPLE), ('Institution + curriculum', BLUE), ('Learning + assessments', GREEN), ('VR / IIVR scoring', AMBER), ('Media + conversion', PURPLE), ('Analytics + reports', BLUE)]),
        ('Data and cloud', [('Supabase PostgreSQL', BLUE), ('Supabase Storage or S3', GREEN), ('Python conversion worker', AMBER), ('Amazon IVS Real-Time', PURPLE), ('Logs + monitoring', RED)]),
    ]
    y = H - 205
    coords = []
    for title, items in layers:
        c.setFillColor(INK); c.setFont('Helvetica-Bold', 12); c.drawString(42, y+88, title)
        row = []
        x = 155
        for name, fill in items:
            w = 150 if len(items) > 4 else 185
            if x + w > W - 30:
                x = 155; y -= 98; row = []
            box(c, x, y, w, 65, name, fill=fill, stroke=GREEN_D if fill == GREEN else BLUE_D)
            row.append((x, y, w)); x += w + 12
        coords.append(row); y -= 118
    # layer arrows
    for upper, lower in zip(coords, coords[1:]):
        for x, yy, w in upper:
            arrow(c, x+w/2, yy, x+w/2, yy-48, color=MUTED, dashed=True)
    c.setFillColor(MUTED); c.setFont('Helvetica', 10)
    c.drawString(42, 105, 'Primary request path: user or headset -> REST API -> authorized backend service -> database or object storage.')
    c.drawString(42, 87, 'Realtime path: headset -> Amazon IVS -> instructor browser; activity/status events -> Socket.IO -> dashboards.')
    c.drawString(42, 69, 'Every protected request carries the authenticated user, role, institution scope and session context.')


def page_roles(c):
    header(c, 2, 'Project ANU - Role-based technical flows', 'The four roles share the platform but have different entry points and permissions')
    roles = [
        ('99 Super Admin', 'Login -> role gate -> global dashboard\nManage institutions, admins, curriculum, certifications, global volumes, mappings, content access and audit reports.', PURPLE, PURPLE_D),
        ('101 Institution Admin', 'Login -> institution scope -> operations dashboard\nCreate batches, assign instructors, enroll trainees, approve volumes, schedule learning and monitor streams.', BLUE, BLUE_D),
        ('102 Instructor', 'Login -> assigned batch scope -> instructor dashboard\nUpload volume and recordings, review trainees, supervise live sessions and recommend reattempts.', AMBER, AMBER_D),
        ('103 Trainee', 'Login from browser or headset -> assigned learning\nStudy resources, complete MindSpark, run VR practice/tests, submit results and view feedback.', GREEN, GREEN_D),
    ]
    x_positions = [45, 335, 625, 915]
    for (title, body, fill, stroke), x in zip(roles, x_positions):
        box(c, x, H-270, 240, 112, title, body, fill=fill, stroke=stroke, title_color=stroke, fs=12)
        box(c, x, H-585, 240, 250, 'Technical route', fill=WHITE, stroke=stroke, title_color=stroke, fs=12)
        steps = {
            '99 Super Admin': ['POST /login', 'JWT role 99', 'Global service calls', 'PostgreSQL writes', 'Object storage admin', 'Analytics / audit'],
            '101 Institution Admin': ['POST /login', 'JWT role 101', 'Institution scope', 'Batch + enrollment', 'Approval + streams', 'Reports / remediation'],
            '102 Instructor': ['POST /login', 'JWT role 102', 'Batch scope', 'Upload + review', 'IVS viewer token', 'Feedback / reattempt'],
            '103 Trainee': ['POST /login', 'JWT role 103', 'Assigned content', 'Activity submission', 'VR session / IVS', 'Score + progress'],
        }[title]
        y = H - 385
        for i, s in enumerate(steps):
            box(c, x+20, y-i*31, 200, 23, s, fill=fill, stroke=stroke, title_color=INK, fs=8.5)
            if i < len(steps)-1: arrow(c, x+120, y-i*31-1, x+120, y-(i+1)*31+23, color=stroke)
    c.setFillColor(MUTED); c.setFont('Helvetica', 10)
    c.drawString(45, 150, 'RBAC is enforced at login, protected routes, controller/service authorization and institution/batch data scope.')


def page_lifecycle(c):
    header(c, 3, 'Project ANU - Complete platform lifecycle', 'From platform setup to learning, evaluation, analytics and remediation')
    steps = [
        ('1. Configure', 'Super Admin\nInstitution, admins, curriculum and resources', PURPLE, PURPLE_D),
        ('2. Organize', 'Institution Admin\nBatch, instructor, trainees and schedules', BLUE, BLUE_D),
        ('3. Prepare assets', 'Instructor / Admin\nUpload, approve, convert, calibrate and map volumes', AMBER, AMBER_D),
        ('4. Assign', 'Admin\nPublish course and targeted learning to a batch', GREEN, GREEN_D),
        ('5. Learn', 'Trainee\nTheory, video, MindSpark and challenges', BLUE, BLUE_D),
        ('6. Simulate', 'Trainee + headset\nLoad volume, scan, annotate, measure and submit', AMBER, AMBER_D),
        ('7. Review', 'Instructor / Admin\nScores, errors, recordings, streams and feedback', PURPLE, PURPLE_D),
        ('8. Improve', 'Analytics engine\nCompetency, benchmark, recommendation and reattempt loop', GREEN, GREEN_D),
    ]
    x0, y, w, gap = 42, H-260, 130, 8
    for i, (title, body, fill, stroke) in enumerate(steps):
        x = x0 + i*(w+gap)
        box(c, x, y, w, 115, title, body, fill=fill, stroke=stroke, title_color=stroke, fs=11)
        if i < len(steps)-1: arrow(c, x+w, y+57, x+w+gap, y+57, color=stroke)
    # second row
    row = [('Volume', 'Raw .vol -> object storage -> worker -> .nii/.nii.gz -> mapped scenario', AMBER, AMBER_D),
           ('Session', 'Headset -> REST API -> session record -> result submission -> score', BLUE, BLUE_D),
           ('Live monitor', 'Headset publisher -> IVS stage -> instructor viewer', PURPLE, PURPLE_D),
           ('Data loop', 'PostgreSQL + object storage -> analytics -> role dashboards', GREEN, GREEN_D)]
    for i, (title, body, fill, stroke) in enumerate(row):
        x = 55 + i*285
        box(c, x, 210, 240, 110, title, body, fill=fill, stroke=stroke, title_color=stroke, fs=11)
    c.setFillColor(MUTED); c.setFont('Helvetica', 10)
    c.drawString(42, 150, 'Decision points: volume approval, account authorization, live supervision, task completion and remediation requirement.')


def page_vr(c):
    header(c, 4, 'Project ANU - VR, headset, LMS and live communication flow', 'Technical sequence for an authenticated simulation with optional instructor monitoring')
    participants = [('Trainee', 70), ('VR headset', 245), ('Express API', 420), ('PostgreSQL', 595), ('Object storage', 770), ('Amazon IVS', 945), ('Instructor', 1120)]
    top = H-145; bottom = 150
    for name, x in participants:
        c.setFillColor(INK); c.setFont('Helvetica-Bold', 10); c.drawCentredString(x, top, name)
        c.setStrokeColor(MUTED); c.setDash(3, 3); c.line(x, top-10, x, bottom); c.setDash()
    events = [
        (top-55, 75, 500, 'Start login / session'),
        (top-95, 500, 725, 'Validate role and assignment'),
        (top-135, 500, 950, 'Request volume and scenario'),
        (top-175, 950, 275, 'Return volume / placement'),
        (top-215, 275, 500, 'Create simulation session'),
        (top-255, 500, 725, 'Save session metadata'),
        (top-295, 275, 1175, 'Publish video/audio when monitoring enabled'),
        (top-335, 1120, 945, 'Instructor subscribes as viewer'),
        (top-375, 275, 500, 'Submit plane, labels and measurement'),
        (top-415, 500, 725, 'Save score, errors and timing'),
        (top-455, 500, 725, 'Update progress and analytics'),
    ]
    for y, x1, x2, label in events:
        arrow(c, x1, y, x2, y, label, color=PURPLE_D if 'IVS' in label or 'video' in label else BLUE_D)
    box(c, 380, 82, 800, 52, 'Technical result', 'Headset receives feedback; instructor sees live or completed-session status; dashboards read persisted results.', fill=GREEN, stroke=GREEN_D, title_color=GREEN_D, fs=10)


def page_cost(c):
    header(c, 5, 'Project ANU - Storage, communication and cloud cost map', 'Cost must be measured separately for database, storage, conversion, streaming, transfer and monitoring')
    cols = [('Flow point', 45, 190), ('Data / service', 235, 350), ('Cost item', 585, 390), ('Main driver', 975, 400)]
    c.setFillColor(INK); c.setFont('Helvetica-Bold', 10)
    for title, x, _ in cols: c.drawString(x, H-145, title)
    rows = [
        ('Login / LMS API', 'Auth, courses, dashboards', 'API compute, requests, logs', 'Requests and execution time'),
        ('PostgreSQL', 'Users, batches, scores, sessions', 'Supabase plan and database usage', 'Rows, queries, connections'),
        ('Raw volumes', '.vol ultrasound files', 'Object storage capacity and PUTs', 'File size and upload count'),
        ('Conversion', '.vol -> .nii/.nii.gz', 'Worker CPU, memory and runtime', 'Conversion duration and size'),
        ('VR downloads', 'NIfTI and scenario assets', 'Storage GETs and data transfer', 'Session count and volume size'),
        ('Results/media', 'Images, recordings, reports', 'Storage and database writes', 'Attempts and retention'),
        ('Live supervision', 'WebRTC video/audio', 'Amazon IVS stage and delivery', 'Stream minutes, viewers'),
        ('Realtime status', 'Socket.IO activity events', 'Realtime compute and logs', 'Connected users and events'),
        ('Monitoring', 'API, worker and IVS logs', 'Cloud logs and metrics', 'Volume and retention'),
    ]
    y = H-175
    for i, row in enumerate(rows):
        fill = WHITE if i % 2 == 0 else HexColor('#EEF5F7')
        c.setFillColor(fill); c.roundRect(40, y-6, W-80, 37, 5, fill=1, stroke=0)
        c.setFillColor(INK); c.setFont('Helvetica', 9)
        for (_, x, width), val in zip(cols, row):
            lines = wrap(val, 'Helvetica', 9, width-10)
            for j, line in enumerate(lines[:2]): c.drawString(x, y+9-j*10, line)
        y -= 42
    box(c, 45, 150, 330, 88, 'Storage locations', 'PostgreSQL / Supabase: users, roles, batches, courses, sessions, scores and logs.\nObject storage: raw volumes, NIfTI, images, recordings and reports.', fill=BLUE, stroke=BLUE_D, title_color=BLUE_D, fs=11)
    box(c, 430, 150, 330, 88, 'Communication paths', 'HTTPS REST: browser or headset to Express API.\nWebRTC / IVS: headset stream to instructor. Socket.IO: activity and status events.', fill=PURPLE, stroke=PURPLE_D, title_color=PURPLE_D, fs=11)
    box(c, 815, 150, 330, 88, 'Pricing assumptions needed', 'Active users, sessions per month, average volume size, retention, concurrent viewers, AWS/Supabase region and plan.', fill=AMBER, stroke=AMBER_D, title_color=AMBER_D, fs=11)
    c.setFillColor(MUTED); c.setFont('Helvetica', 10)
    c.drawString(45, 105, 'Use the cost categories above to attach actual provider rates and monthly usage. Do not combine IVS or conversion cost into a generic API estimate.')


def build():
    c = canvas.Canvas(str(OUT), pagesize=landscape(A3))
    c.setTitle('Project ANU Complete Centralized Technical Flowchart')
    c.setAuthor('Codex')
    for page in (page_central, page_roles, page_lifecycle, page_vr, page_cost):
        page(c); c.showPage()
    c.save()
    print(OUT.resolve())


if __name__ == '__main__':
    build()
