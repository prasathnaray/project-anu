# Project ANU — End-to-End User, Headset, LMS and Cloud Flow

## Purpose

This is the detailed flow requested for Project ANU. It shows the user journey, the communication between the web application, VR headset and LMS/backend, where data is stored, and where cloud cost is incurred.

> Cost figures below are cost categories and calculation points. Exact amounts depend on the AWS/Supabase region, plan, file sizes, session duration, number of learners and monthly traffic. They should be filled using the deployment's billing data before sharing a final commercial estimate.

## 0. Centralized role-to-system technical flow

The following is the central flow for the complete platform. All roles enter through the same authentication and authorization layer, then reach only the modules permitted for their role.

```mermaid
flowchart TB
    Start([User opens ANU]) --> Client[React Web App or VR Client]
    Client --> Login[POST login / refresh token]
    Login --> Device[Detect browser or VR device]
    Device --> Auth[Authentication service]
    Auth --> UserDB[(user_data and user_sessions)]
    UserDB --> Role{Role and account status}

    Role -->|99 Super Admin| SA[Super Admin workspace]
    Role -->|101 Institution Admin| IA[Institution Admin workspace]
    Role -->|102 Instructor| IN[Instructor workspace]
    Role -->|103 Trainee| TR[Trainee workspace]
    Role -->|Invalid / inactive| Denied[Reject access and log attempt]

    subgraph AdminFunctions[Administration and governance]
        SA --> SA1[Manage institutions, administrators and global settings]
        SA --> SA2[Manage curriculum, certifications and courses]
        SA --> SA3[Manage global volumes, mappings and content access]
        IA --> IA1[Create batches and assign instructors]
        IA --> IA2[Create / manage trainees and schedules]
        IA --> IA3[Approve instructor-uploaded volumes]
        IA --> IA4[Monitor streams and institutional analytics]
        IN --> IN1[View assigned batches and trainees]
        IN --> IN2[Upload volumes and reference recordings]
        IN --> IN3[Review progress and supervise sessions]
    end

    subgraph LearningFunctions[Learner activity]
        TR --> TR1[View dashboard, batch and assigned courses]
        TR --> TR2[Study theory, video and interactive resources]
        TR --> TR3[Complete MindSpark activities and assessments]
        TR --> TR4[Launch VR practice or test session]
        TR --> TR5[Submit questions and view feedback]
    end

    SA1 --> RBAC[RBAC and institution access rules]
    SA2 --> Curriculum[Curriculum and course service]
    IA1 --> Batch[Batch, enrollment and schedule service]
    IA2 --> Batch
    IN1 --> Batch
    TR1 --> Batch
    IA3 --> Volume[Volume governance service]
    IN2 --> Volume
    Volume --> Convert[Python .vol to NIfTI conversion worker]
    SA3 --> Mapping[Course and volume mapping]
    Convert --> Mapping
    TR2 --> Content[Learning content service]
    TR3 --> Assessment[Assessment and MindSpark service]
    TR4 --> VR[VR / IIVR simulation service]
    IN3 --> Review[Progress and result review]
    IA4 --> Monitor[Monitoring and streaming workspace]

    RBAC --> DB[(Supabase PostgreSQL)]
    Curriculum --> DB
    Batch --> DB
    Content --> DB
    Assessment --> DB
    VR --> DB
    Review --> DB
    Mapping --> DB
    Monitor --> DB

    Volume --> Storage[(Object storage: Supabase Storage or Amazon S3)]
    Convert --> Storage
    Mapping --> Storage
    VR --> Storage
    VR --> IVS[Amazon IVS Real-Time]
    Monitor --> IVS
    VR -. realtime activity .-> Socket[Socket.IO / realtime events]
    Socket --> Monitor
    DB --> Analytics[Analytics and competency engine]
    Analytics --> Dashboards[Role-specific dashboards and recommendations]
    Dashboards --> SA
    Dashboards --> IA
    Dashboards --> IN
    Dashboards --> TR
```

## Role permissions

| Role | Main responsibility | Main technical modules |
|---|---|---|
| Super Admin (`99`) | Platform-wide governance | Institutions, administrators, curriculum, certifications, global volumes, course mapping, content access, reattempt oversight |
| Institution Admin (`101`) | Institution operations | Batches, instructors, trainees, schedules, approvals, institutional streams, progress monitoring |
| Instructor (`102`) | Teaching and assessment | Assigned batches, trainee review, volume upload, reference recordings, supervision, performance feedback |
| Trainee (`103`) | Learning and simulation | Dashboard, assigned courses, theory, MindSpark, VR practice/tests, queries, progress and feedback |

## 0.1 Role-independent authentication and authorization flow

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Client as React Web / VR Client
    participant API as Express API
    participant Middleware as Device, JWT and RBAC Middleware
    participant Auth as Auth Controller
    participant DB as Supabase PostgreSQL
    participant Session as Session Store

    User->>Client: Enter email and password
    Client->>API: POST /api/v1/login
    API->>Middleware: Detect device and request metadata
    Middleware->>Auth: Forward normalized login request
    Auth->>DB: Find user by protected email lookup
    DB-->>Auth: User row, role and account status
    alt User missing or inactive
        Auth-->>Client: 404 / account disabled
    else User found
        Auth->>Auth: Verify password hash
        alt Password invalid
            Auth->>DB: Log failed login attempt
            Auth-->>Client: 401 invalid credentials
        else Password valid
            Auth->>Session: Create session with device and IP metadata
            Session->>DB: Insert user session
            Auth->>Auth: Generate access token and refresh token
            Auth-->>Client: Tokens, profile, role and device flags
            Client->>API: Request protected route with token
            API->>Middleware: Verify token, session and role permission
            Middleware-->>API: Authorized request context
        end
    end
```

## 0.2 Shared data and service architecture

```mermaid
flowchart LR
    subgraph Presentation[Presentation clients]
        Web[React web portal]
        VRClient[VR headset / simulator client]
    end

    subgraph Gateway[Communication gateway]
        HTTP[HTTPS REST API]
        WS[Socket.IO realtime API]
        Stream[WebRTC / IVS connection]
    end

    subgraph Services[Backend services]
        Identity[Authentication, JWT, sessions and RBAC]
        Academic[Institutions, batches, curriculum, courses and schedules]
        Learning[Resources, MindSpark, challenges and assessments]
        Simulation[IIVR, volume assignment, scoring and test sessions]
        Media[Upload, approval, conversion and recording management]
        Reporting[Analytics, dashboards, benchmark and recommendations]
    end

    subgraph Persistence[Persistence and processing]
        Relational[(PostgreSQL / Supabase tables)]
        Blob[(Object storage)]
        Converter[Python conversion worker]
        IVS[AWS IVS Real-Time]
        Logs[Logs and monitoring]
    end

    Web --> HTTP
    Web <--> WS
    Web --> Stream
    VRClient --> HTTP
    VRClient --> Stream
    HTTP --> Identity
    HTTP --> Academic
    HTTP --> Learning
    HTTP --> Simulation
    HTTP --> Media
    HTTP --> Reporting
    WS --> Reporting
    Stream --> IVS
    Identity --> Relational
    Academic --> Relational
    Learning --> Relational
    Simulation --> Relational
    Reporting --> Relational
    Media --> Relational
    Media --> Blob
    Media --> Converter
    Converter --> Blob
    Converter --> Relational
    IVS --> Logs
    HTTP --> Logs
    Converter --> Logs
```

## 0.3 Complete platform lifecycle

```mermaid
flowchart TD
    A[Super Admin configures institution and platform] --> B[Super Admin creates curriculum, certification, course and resources]
    B --> C[Institution Admin creates batch]
    C --> D[Institution Admin assigns instructor]
    C --> E[Institution Admin enrolls trainees]
    D --> F[Instructor prepares volume and reference assets]
    F --> G{Volume approved?}
    G -->|No| H[Return for correction or reject]
    H --> F
    G -->|Yes| I[Convert .vol to NIfTI and calibrate placement]
    I --> J[Map volume to module, unit and practice/test type]
    J --> K[Assign course and schedule to trainee]
    K --> L[Trainee opens learning unit]
    L --> M{Learning mode}
    M -->|Theory| N[Study content and record completion]
    M -->|MindSpark| O[Attempt interactive activity and save score]
    M -->|VR| P[Start headset session and load scenario]
    P --> Q[Scan, acquire plane, annotate and measure]
    Q --> R{Instructor monitoring required?}
    R -->|Yes| S[Publish live stream through IVS]
    S --> T[Instructor views stream and supervises]
    R -->|No| U[Continue self-guided simulation]
    T --> V[Submit simulation result]
    U --> V
    N --> W[Update progress]
    O --> W
    V --> W
    W --> X[Analytics calculates scores, competency and recommendations]
    X --> Y[Instructor and admins review dashboards]
    Y --> Z{Trainee needs remediation?}
    Z -->|Yes| AA[Assign reattempt or targeted practice]
    AA --> L
    Z -->|No| AB([Complete module or certification milestone])
```

## 1. Main trainee journey

```mermaid
flowchart TD
    A([Trainee opens ANU LMS]) --> B[React web app loads]
    B --> C[Enter email and password]
    C --> D{Credentials valid?}

    D -->|No| E[Show login error]
    E --> F{Forgot password?}
    F -->|Yes| G[Request recovery link or OTP]
    G --> H[Verify email or phone]
    H --> I[Set new password]
    I --> C
    F -->|No| C

    D -->|Yes| J[Backend creates authenticated session and JWT]
    J --> K[Load trainee profile, batch and assigned courses]
    K --> L[Display dashboard and learning progress]
    L --> M{Select activity}

    M -->|Theory / video| N[Open learning resource]
    N --> O[Track completion and time spent]
    O --> Z[Update progress and dashboard]

    M -->|MindSpark / assessment| P[Load questions or interactive activity]
    P --> Q[Trainee submits answers]
    Q --> R[Calculate score and save attempt]
    R --> Z

    M -->|VR simulation| S[Launch VR headset or simulator]
    S --> T[Authenticate headset and create simulation session]
    T --> U[Download assigned volume, placement and scenario metadata]
    U --> V[Trainee performs scan with probe]
    V --> W[Acquire plane, freeze image, annotate and measure]
    W --> X[Submit simulation result]
    X --> Y[Save score, errors, measurements and attempt details]
    Y --> Z

    Z --> AA[Analytics calculates competency and recommendations]
    AA --> AB([Trainee and instructor see updated progress])
```

## 1.1 Super Admin technical flow

```mermaid
flowchart TD
    A[Super Admin login] --> B[JWT and role 99 authorization]
    B --> C[Super Admin dashboard]
    C --> D{Select administration area}
    D --> E[Institution management]
    E --> E1[Create or update institution]
    E1 --> E2[Create institution admin]
    E2 --> E3[Set institution status and access scope]
    D --> F[Curriculum and certification management]
    F --> F1[Create certification]
    F1 --> F2[Create course, chapter and module]
    F2 --> F3[Attach theory, video, MindSpark and VR resources]
    D --> G[Global volume and content management]
    G --> G1[Upload or inspect volume]
    G1 --> G2[Approve, convert and calibrate volume]
    G2 --> G3[Map volume to module and unit]
    D --> H[Access and governance]
    H --> H1[Control institution and batch content access]
    H1 --> H2[Review audit logs, reattempts and reports]
    E3 --> I[(PostgreSQL: institution, user and role records)]
    F3 --> J[(PostgreSQL: curriculum and resource records)]
    G3 --> K[(Object storage: volumes, images and recordings)]
    H2 --> L[Platform analytics and audit dashboard]
```

## 1.2 Institution Admin technical flow

```mermaid
flowchart TD
    A[Institution Admin login] --> B[JWT and role 101 authorization]
    B --> C[Institution dashboard]
    C --> D[Create or update batch]
    D --> E[Assign certification and course]
    E --> F[Assign instructor]
    F --> G[Create or import trainees]
    G --> H[Enroll trainees into batch]
    H --> I[Configure targeted learning and schedule]
    I --> J[Publish assigned course]
    J --> K[(PostgreSQL: batch, enrollment and schedule)]
    C --> L[Review pending volume uploads]
    L --> M{Approve volume?}
    M -->|No| N[Reject or request correction]
    M -->|Yes| O[Trigger conversion and calibration workflow]
    O --> P[(Object storage + conversion status)]
    C --> Q[Open streams workspace]
    Q --> R[List active trainee sessions]
    R --> S[Request viewer token]
    S --> T[Watch trainee through Amazon IVS]
    C --> U[Review batch progress and analytics]
    U --> V[Identify low performance or incomplete learning]
    V --> W[Assign remediation or reattempt]
    W --> K
```

## 1.3 Instructor technical flow

```mermaid
flowchart TD
    A[Instructor login] --> B[JWT and role 102 authorization]
    B --> C[Instructor dashboard]
    C --> D[Open assigned batch]
    D --> E[View trainees, courses and progress]
    C --> F[Upload ultrasound volume]
    F --> G[Store raw .vol and metadata]
    G --> H[Set status: pending approval]
    H --> I[Institution Admin review]
    I -->|Rejected| J[Correct metadata or upload replacement]
    J --> F
    I -->|Approved| K[Convert to NIfTI]
    K --> L[Upload placement calibration]
    L --> M[Upload expert shadow or step recording]
    M --> N[Map to training unit or request admin mapping]
    C --> O[Open trainee session monitor]
    O --> P[Select active trainee]
    P --> Q[Join as IVS viewer]
    Q --> R[Observe probe movement, video and session status]
    R --> S[Provide guidance or feedback]
    C --> T[Review submitted results]
    T --> U[Inspect score, errors, measurements and attempts]
    U --> V{Needs additional practice?}
    V -->|Yes| W[Recommend or assign reattempt]
    V -->|No| X[Mark review complete]
```

## 1.4 Trainee technical flow

```mermaid
flowchart TD
    A[Trainee login from browser or headset] --> B[JWT, session and role 103 validation]
    B --> C[Trainee dashboard]
    C --> D[Load batch, assigned courses and schedule]
    D --> E{Choose learning activity}
    E --> F[Theory / video]
    F --> F1[Read or watch resource]
    F1 --> F2[Record completion and time]
    E --> G[MindSpark / challenge]
    G --> G1[Load questions or activity]
    G1 --> G2[Submit answer]
    G2 --> G3[Save attempt and score]
    E --> H[VR practice or test]
    H --> H1[Create simulation session]
    H1 --> H2[Load volume, placement and reference assets]
    H2 --> H3[Perform scan and probe movements]
    H3 --> H4[Freeze plane]
    H4 --> H5[Annotate and label anatomy]
    H5 --> H6[Measure and submit result]
    H6 --> H7[Save score, timing, error and measurement offset]
    H7 --> H8{Live supervision?}
    H8 -->|Yes| H9[Publish stream and receive instructor monitoring]
    H8 -->|No| I[Continue self-guided session]
    H9 --> I
    F2 --> J[Update progress and analytics]
    G3 --> J
    I --> J
    J --> K[Show feedback and recommendations]
    C --> L[Raise or view learning query]
    L --> M[(PostgreSQL: query record)]
```

## 2. System and cloud communication flow

```mermaid
flowchart LR
    subgraph Users[Users and devices]
        Trainee[Trainee]
        Instructor[Instructor / Admin]
        Browser[React web browser]
        Headset[VR headset / simulator]
    end

    subgraph Application[ANU application]
        API[Node.js / Express API]
        Auth[Authentication and session service]
        Learning[Course, batch and LMS service]
        Simulation[VR / IIVR evaluation service]
        Analytics[Progress and analytics service]
        Realtime[Socket.IO realtime events]
        Worker[Python volume conversion worker]
    end

    subgraph Cloud[Cloud services and storage]
        DB[(Supabase PostgreSQL\nusers, courses, sessions, scores, logs)]
        Objects[(Supabase Storage or Amazon S3\n.vol, NIfTI, images, recordings)]
        IVS[Amazon IVS Real-Time\nlive headset stream]
        Compute[Application and conversion compute\nECS / EC2 / Batch / Lambda as deployed]
        Logs[Cloud logs and monitoring]
    end

    Trainee --> Browser
    Instructor --> Browser
    Trainee --> Headset
    Browser -->|HTTPS REST requests| API
    Headset -->|HTTPS REST requests| API
    Browser <-->|Realtime events| Realtime

    API --> Auth
    API --> Learning
    API --> Simulation
    API --> Analytics
    API --> Compute
    Auth --> DB
    Learning --> DB
    Simulation --> DB
    Analytics --> DB
    API --> Objects
    Simulation --> Objects
    Realtime -->|activity and status updates| Browser

    Headset -->|WebRTC publish video/audio when monitoring is enabled| IVS
    Instructor -->|Web browser subscribes to trainee stream| IVS

    API -->|start conversion| Worker
    Worker -->|read raw .vol| Objects
    Worker -->|write converted .nii/.nii.gz| Objects
    Worker -->|conversion status| DB
    API --> Logs
    Worker --> Logs
    IVS --> Logs
```

## 3. Detailed VR simulation flow

```mermaid
sequenceDiagram
    autonumber
    actor Trainee
    participant Headset as VR Headset / Simulator
    participant API as ANU Express API
    participant DB as Supabase PostgreSQL
    participant Storage as Object Storage
    participant IVS as Amazon IVS Real-Time
    actor Instructor

    Trainee->>Headset: Open assigned simulation
    Headset->>API: Login / refresh token
    API->>DB: Validate user, batch and access
    DB-->>API: User and assignment details
    API-->>Headset: Authenticated session

    Headset->>API: Start simulation session
    API->>DB: Create session and activity log
    API->>Storage: Request assigned volume and reference assets
    Storage-->>Headset: Volume / scenario data through API or signed download

    Headset->>Headset: Load 3D volume and placement calibration
    Headset->>Headset: Track probe movement and trainee actions

    opt Live instructor monitoring
        Headset->>API: Request streaming session
        API->>IVS: Create stage and participant token
        IVS-->>API: Stage details and token
        API-->>Headset: Publisher token
        Headset->>IVS: Publish live video/audio
        Instructor->>API: Request active trainee stream
        API->>IVS: Create viewer token
        API-->>Instructor: Viewer token
        Instructor->>IVS: Subscribe to trainee stream
    end

    Trainee->>Headset: Acquire plane and freeze image
    Trainee->>Headset: Place annotations and labels
    Trainee->>Headset: Place calipers and submit measurement
    Headset->>API: Submit task result
    API->>DB: Save result, score, errors and measurement offset
    API->>Storage: Save submitted image or recording when applicable
    API-->>Headset: Feedback and next task

    Trainee->>Headset: End simulation
    Headset->>API: End test
    API->>DB: Finalize session and update progress
    API->>Analytics: Recalculate competency and recommendations
    API-->>Instructor: Updated trainee status
```

## 4. Content and volume preparation flow

```mermaid
flowchart TD
    A[Instructor or admin selects ultrasound .vol file] --> B[Upload through ANU API]
    B --> C[Store raw file in object storage]
    C --> D[Save file path and metadata in PostgreSQL]
    D --> E{Uploader and approval status}
    E -->|Instructor upload| F[Institution admin reviews]
    E -->|Admin upload| G[Auto-approved or approved by policy]
    F -->|Rejected| H[Mark rejected and retain or archive by policy]
    F -->|Approved| G
    G --> I[Trigger asynchronous conversion job]
    I --> J[Worker reads .vol file]
    J --> K[Parse and convert to NIfTI]
    K --> L[Write .nii or .nii.gz to object storage]
    L --> M[Update conversion status in PostgreSQL]
    M --> N[Add volume placement / calibration]
    N --> O[Upload expert shadow or step recording]
    O --> P[Map volume to course, module and unit]
    P --> Q([Scenario available to VR trainees])
```

## 5. Cloud cost points

| Flow point | What is stored or consumed | Cloud cost to measure | Cost driver |
|---|---|---|---|
| Login and LMS API calls | Authentication requests, course and dashboard API calls | Application compute, API requests and logs | Number of requests and execution time |
| PostgreSQL database | Users, batches, courses, sessions, scores, activity logs | Supabase plan/database usage | Database size, connections and query volume |
| Raw volume upload | GE Kretz `.vol` files | Object storage capacity and upload requests | File size and number of uploaded volumes |
| NIfTI conversion | CPU/memory used by Python worker | EC2/ECS/Batch/Lambda compute | Conversion duration and file size |
| Converted volume download | `.nii`/`.nii.gz` delivered to headset | Object-storage download and data transfer | Number of simulations and volume size |
| Submitted results | Images, annotations, recordings and reports | Object storage and database writes | Attempts, retention and media size |
| Realtime activity | Progress/status events through Socket.IO | Application compute, realtime service and logs | Connected users and event volume |
| Live tele-mentoring | Headset video/audio sent to instructor | Amazon IVS stage, participant and data usage | Stream duration, publishers, viewers and region |
| Monitoring and troubleshooting | Application, worker and streaming logs | Cloud logging and metrics | Log volume and retention period |

## 6. Cost-estimation template

Use this section with actual monthly usage assumptions:

```text
Monthly cloud cost
= application/API compute
+ database/Supabase plan
+ object storage for raw and converted volumes
+ object-storage requests and downloads
+ volume-conversion compute
+ realtime communication
+ Amazon IVS live streaming
+ data transfer
+ logs and monitoring
```

Recommended assumptions to fill in before final pricing:

- Number of registered trainees and instructors.
- Average monthly active trainees.
- Average VR sessions per trainee and average session duration.
- Average `.vol` and NIfTI file size.
- Number of new volumes uploaded per month.
- Whether old volumes, recordings and logs are retained indefinitely.
- Number of simultaneous instructor monitoring sessions.
- AWS and Supabase regions/plans.

## Notes and implementation assumptions

- The repository shows Supabase/PostgreSQL for application data, object storage integrations for volume/media assets, an Express backend, a Python volume-conversion workload, Socket.IO activity updates and Amazon IVS Real-Time for live streaming.
- The exact storage provider for each object should be confirmed in deployment configuration. The flow therefore labels it “Supabase Storage or Amazon S3” where the repository supports both patterns.
- Cloud costs should be shown as separate line items. In particular, IVS streaming and volume conversion can vary substantially with usage and should not be hidden inside a generic API cost.
