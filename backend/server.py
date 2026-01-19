from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
from passlib.context import CryptContext
import jwt
import httpx

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Security
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()
SECRET_KEY = os.environ.get('SECRET_KEY', 'ata-university-secret-key-2025')
ALGORITHM = "HS256"

app = FastAPI()
api_router = APIRouter(prefix="/api")

# Models
class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    email: EmailStr
    full_name: str
    role: str = "admin"
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    full_name: str
    role: str = "writer"  # admin, writer, support

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    full_name: Optional[str] = None
    role: Optional[str] = None

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: User

class News(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    content: str
    summary: str
    image_url: str
    category: str = "genel"
    published_date: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    is_featured: bool = False

class NewsCreate(BaseModel):
    title: str
    content: str
    summary: str
    image_url: str
    category: str = "genel"
    is_featured: bool = False

class Announcement(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    content: str
    priority: str = "normal"  # high, normal, low
    published_date: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    is_active: bool = True

class AnnouncementCreate(BaseModel):
    title: str
    content: str
    priority: str = "normal"
    is_active: bool = True

class Event(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    event_date: str
    location: str
    image_url: Optional[str] = None
    category: str = "etkinlik"
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class EventCreate(BaseModel):
    title: str
    description: str
    event_date: str
    location: str
    image_url: Optional[str] = None
    category: str = "etkinlik"

class AcademicUnit(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    type: str  # faculty, vocational_school, institute
    description: str
    dean_name: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    departments: List[str] = []
    image_url: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class AcademicUnitCreate(BaseModel):
    name: str
    type: str
    description: str
    dean_name: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    departments: List[str] = []
    image_url: Optional[str] = None

class SliderImage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    subtitle: Optional[str] = None
    image_url: str
    link_url: Optional[str] = None
    order: int = 0
    is_active: bool = True
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class SliderImageCreate(BaseModel):
    title: str
    subtitle: Optional[str] = None
    image_url: str
    link_url: Optional[str] = None
    order: int = 0
    is_active: bool = True

class ContactInfo(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    address: str
    phone: str
    email: str
    fax: Optional[str] = None
    map_lat: float
    map_lng: float
    social_media: dict = {}
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class ContactInfoUpdate(BaseModel):
    address: str
    phone: str
    email: str
    fax: Optional[str] = None
    map_lat: float
    map_lng: float
    social_media: dict = {}

class QuickLink(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    url: str
    icon: Optional[str] = None
    order: int = 0
    is_active: bool = True

class QuickLinkCreate(BaseModel):
    title: str
    url: str
    icon: Optional[str] = None
    order: int = 0
    is_active: bool = True

class Settings(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    site_name: str = "ATA ÜNİVERSİTESİ"
    site_tagline: str = "Geleceği İnşa Eden Üniversite"
    site_logo: Optional[str] = None
    students_count: int = 15000
    faculty_count: int = 800
    faculties_count: int = 12
    partnerships_count: int = 50
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class SettingsUpdate(BaseModel):
    site_name: str
    site_tagline: str
    site_logo: Optional[str] = None
    students_count: int
    faculty_count: int
    faculties_count: int
    partnerships_count: int

class ContactMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    subject: str
    message: str
    is_read: bool = False
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class ContactMessageCreate(BaseModel):
    name: str
    email: str
    subject: str
    message: str

class FooterLink(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    url: str
    category: str  # "quick_links" or "student_systems"
    order: int = 0
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class FooterLinkCreate(BaseModel):
    title: str
    url: str
    category: str
    order: int = 0

class FooterSettings(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    description: str = "ATA Üniversitesi, eğitim ve araştırma alanında öncü, yenilikçi ve topluma katkı sağlayan bir kurumdur."
    address: str = "ATA Üniversitesi, Merkez Kampüs, Türkiye"
    phone: str = "+90 (123) 456 78 90"
    email: str = "info@ata.edu.tr"
    facebook_url: Optional[str] = None
    twitter_url: Optional[str] = None
    instagram_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    youtube_url: Optional[str] = None
    quick_links_title: str = "Hızlı Bağlantılar"
    student_systems_title: str = "Öğrenci Sistemleri"
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class FooterSettingsUpdate(BaseModel):
    description: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    facebook_url: Optional[str] = None
    twitter_url: Optional[str] = None
    instagram_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    youtube_url: Optional[str] = None
    quick_links_title: Optional[str] = None
    student_systems_title: Optional[str] = None

class AcademicStaff(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    title: str  # Prof. Dr., Doç. Dr., Dr. Öğr. Üyesi, etc.
    department: str
    email: str
    phone: Optional[str] = None
    office: Optional[str] = None
    bio: Optional[str] = None
    image_url: Optional[str] = None
    order: int = 0
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class AcademicStaffCreate(BaseModel):
    name: str
    title: str
    department: str
    email: str
    phone: Optional[str] = None
    office: Optional[str] = None
    bio: Optional[str] = None
    image_url: Optional[str] = None
    order: int = 0

class AcademicStaffUpdate(BaseModel):
    name: Optional[str] = None
    title: Optional[str] = None
    department: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    office: Optional[str] = None
    bio: Optional[str] = None
    image_url: Optional[str] = None
    order: Optional[int] = None

class AcademicCalendar(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    start_date: str
    end_date: str
    description: Optional[str] = None
    semester: str  # "Güz" or "Bahar"
    year: str  # "2024-2025"
    order: int = 0
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class AcademicCalendarCreate(BaseModel):
    title: str
    start_date: str
    end_date: str
    description: Optional[str] = None
    semester: str
    year: str
    order: int = 0

class AcademicCalendarUpdate(BaseModel):
    title: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    description: Optional[str] = None
    semester: Optional[str] = None
    year: Optional[str] = None
    order: Optional[int] = None

class CourseDepartment(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    order: int = 0
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class CourseDepartmentCreate(BaseModel):
    name: str
    order: int = 0

class CourseDepartmentUpdate(BaseModel):
    name: Optional[str] = None
    order: Optional[int] = None

class CourseSchedule(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    department_id: str
    day: str  # Pazartesi, Salı, Çarşamba, Perşembe, Cuma
    start_time: str  # "09:00"
    end_time: str  # "10:00"
    course_name: str
    room: str
    instructor: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class CourseScheduleCreate(BaseModel):
    department_id: str
    day: str
    start_time: str
    end_time: str
    course_name: str
    room: str
    instructor: Optional[str] = None

class CourseScheduleUpdate(BaseModel):
    department_id: Optional[str] = None
    day: Optional[str] = None
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    course_name: Optional[str] = None
    room: Optional[str] = None
    instructor: Optional[str] = None

class ContactPageSettings(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    address: str = "ATA Üniversitesi, Ataşehir, İstanbul, Türkiye"
    phone: str = "+90 (216) 555 00 00"
    email: str = "info@ata.edu.tr"
    map_lat: float = 40.9827
    map_lng: float = 29.1266
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class ContactPageSettingsUpdate(BaseModel):
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    map_lat: Optional[float] = None
    map_lng: Optional[float] = None

class AboutSettings(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    hero_title: str = "Hakkımızda"
    hero_description: str = "ATA Üniversitesi olarak, eğitim ve araştırma alanında öncü, yenilikçi ve topluma katkı sağlayan bir kurum olmayı hedefliyoruz."
    main_title: str = "ATA Üniversitesi"
    main_image_url: str = "https://images.unsplash.com/photo-1704748082614-8163a88e56b8"
    main_paragraph1: str = "ATA Üniversitesi, Türkiye'nin önde gelen eğitim kurumlarından biri olarak, akademik mükemmelliği ve araştırma odaklı yaklaşımı ile tanınmaktadır. Üniversitemiz, öğrencilerine sadece teorik bilgi değil, aynı zamanda pratik deneyim ve yaşam boyu öğrenme becerilerini kazandırmayı amaçlamaktadır."
    main_paragraph2: str = "Modern eğitim olanaklarımız, deneyimli akademik kadromuz ve uluslararası işbirliklikleri sayesinde, öğrencilerimize dünya çapında bir eğitim sunuyoruz. Üniversitemiz, 12 fakülte, 5 meslek yüksekokulu ve 3 enstitü ile geniş bir akademik yelpazede hizmet vermektedir."
    mission_title: str = "Misyonumuz"
    mission_description: str = "Bilim, teknoloji ve sanatta öncü, yenilikçi ve topluma katkı sağlayan bireyler yetiştirmek."
    vision_title: str = "Vizyonumuz"
    vision_description: str = "Dünya standartlarında eğitim ve araştırma ile uluslararası alanda tanınan bir üniversite olmak."
    values_title: str = "Değerlerimiz"
    values_description: str = "Kalite, dürüstlük, saygı, yenilikçilik ve sürekli gelişim ilkelerimizdir."
    social_title: str = "Toplumsal Sorumluluk"
    social_description: str = "Topluma ve çevreye duyarlı, sosyal sorumluluk bilinci yüksek bireyler yetiştiriyoruz."
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class AboutSettingsUpdate(BaseModel):
    hero_title: Optional[str] = None
    hero_description: Optional[str] = None
    main_title: Optional[str] = None
    main_image_url: Optional[str] = None
    main_paragraph1: Optional[str] = None
    main_paragraph2: Optional[str] = None
    mission_title: Optional[str] = None
    mission_description: Optional[str] = None
    vision_title: Optional[str] = None
    vision_description: Optional[str] = None
    values_title: Optional[str] = None
    values_description: Optional[str] = None
    social_title: Optional[str] = None
    social_description: Optional[str] = None

class Student(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    student_no: str  # Auto-generated
    tc_no: str
    first_name: str
    last_name: str
    email: str
    phone: str
    department: str
    class_level: str  # 1, 2, 3, 4
    password: str  # Hashed
    status: str = "pending"  # pending, approved, rejected
    gpa: float = 0.0
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    approved_at: Optional[str] = None
    approved_by: Optional[str] = None

class StudentRegister(BaseModel):
    tc_no: str
    first_name: str
    last_name: str
    email: str
    phone: str
    department: str
    class_level: str
    password: str

class StudentLogin(BaseModel):
    student_no: str
    password: str

class StudentUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    department: Optional[str] = None
    class_level: Optional[str] = None
    status: Optional[str] = None
    gpa: Optional[float] = None

class StudentGrade(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    student_id: str
    course_name: str
    course_code: str
    credit: int
    midterm: Optional[float] = None
    final: Optional[float] = None
    grade: Optional[str] = None  # AA, BA, BB, CB, CC, DC, DD, FD, FF
    semester: str  # Güz 2024, Bahar 2025
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class StudentGradeCreate(BaseModel):
    student_id: str
    course_name: str
    course_code: str
    credit: int
    midterm: Optional[float] = None
    final: Optional[float] = None
    grade: Optional[str] = None
    semester: str

class StudentGradeUpdate(BaseModel):
    course_name: Optional[str] = None
    course_code: Optional[str] = None
    credit: Optional[int] = None
    midterm: Optional[float] = None
    final: Optional[float] = None
    grade: Optional[str] = None
    semester: Optional[str] = None

class StudentAttendance(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    student_id: str
    course_name: str
    total_hours: int
    attended_hours: int
    absence_percentage: float
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class StudentAttendanceCreate(BaseModel):
    student_id: str
    course_name: str
    total_hours: int
    attended_hours: int

class StudentAttendanceUpdate(BaseModel):
    course_name: Optional[str] = None
    total_hours: Optional[int] = None
    attended_hours: Optional[int] = None

# Helper functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(days=7)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        user = await db.users.find_one({"username": username}, {"_id": 0})
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return User(**user)
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_current_admin(current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user

# Startup event to create default admin and sample data
@app.on_event("startup")
async def create_default_admin():
    existing_admin = await db.users.find_one({"username": "admin"})
    if not existing_admin:
        hashed_password = get_password_hash("admin123")
        default_admin = User(
            username="admin",
            email="admin@ata.edu.tr",
            full_name="System Administrator",
            role="admin"
        )
        doc = default_admin.model_dump()
        doc['password'] = hashed_password
        await db.users.insert_one(doc)
        logging.info("Default admin user created")
    
    # Create course departments if they don't exist
    existing_depts = await db.course_departments.count_documents({})
    if existing_depts == 0:
        departments = [
            CourseDepartment(id=str(uuid.uuid4()), name="Bilgisayar Programcılığı", order=1),
            CourseDepartment(id=str(uuid.uuid4()), name="Yazılım Mühendisliği", order=2)
        ]
        for dept in departments:
            await db.course_departments.insert_one(dept.model_dump())
        logging.info("Course departments created")
        
        # Create sample course schedules
        dept_bp = departments[0]  # Bilgisayar Programcılığı
        dept_ym = departments[1]  # Yazılım Mühendisliği
        
        # Bilgisayar Programcılığı schedules
        bp_schedules = [
            CourseSchedule(department_id=dept_bp.id, day="Pazartesi", start_time="09:00", end_time="11:00", course_name="Programlama Temelleri", room="A101", instructor="Prof. Dr. Ahmet Yılmaz"),
            CourseSchedule(department_id=dept_bp.id, day="Pazartesi", start_time="11:00", end_time="13:00", course_name="Veri Yapıları", room="A102", instructor="Doç. Dr. Mehmet Demir"),
            CourseSchedule(department_id=dept_bp.id, day="Salı", start_time="09:00", end_time="11:00", course_name="Veritabanı Yönetimi", room="B201", instructor="Dr. Öğr. Üyesi Ayşe Kaya"),
            CourseSchedule(department_id=dept_bp.id, day="Salı", start_time="13:00", end_time="15:00", course_name="Web Programlama", room="B202", instructor="Öğr. Gör. Fatma Çelik"),
            CourseSchedule(department_id=dept_bp.id, day="Çarşamba", start_time="10:00", end_time="12:00", course_name="Nesne Yönelimli Programlama", room="A103", instructor="Prof. Dr. Ahmet Yılmaz"),
            CourseSchedule(department_id=dept_bp.id, day="Perşembe", start_time="09:00", end_time="11:00", course_name="Algoritma Analizi", room="C301", instructor="Doç. Dr. Mehmet Demir"),
            CourseSchedule(department_id=dept_bp.id, day="Perşembe", start_time="14:00", end_time="16:00", course_name="Mobil Uygulama Geliştirme", room="B203", instructor="Dr. Öğr. Üyesi Ayşe Kaya"),
            CourseSchedule(department_id=dept_bp.id, day="Cuma", start_time="10:00", end_time="12:00", course_name="İşletim Sistemleri", room="A104", instructor="Öğr. Gör. Fatma Çelik"),
        ]
        
        # Yazılım Mühendisliği schedules
        ym_schedules = [
            CourseSchedule(department_id=dept_ym.id, day="Pazartesi", start_time="09:00", end_time="11:00", course_name="Yazılım Mühendisliği Temelleri", room="D401", instructor="Prof. Dr. Can Öztürk"),
            CourseSchedule(department_id=dept_ym.id, day="Pazartesi", start_time="13:00", end_time="15:00", course_name="Yazılım Tasarımı ve Mimarisi", room="D402", instructor="Doç. Dr. Zeynep Aydın"),
            CourseSchedule(department_id=dept_ym.id, day="Salı", start_time="10:00", end_time="12:00", course_name="Yazılım Test ve Kalite", room="E501", instructor="Dr. Öğr. Üyesi Emre Şahin"),
            CourseSchedule(department_id=dept_ym.id, day="Salı", start_time="14:00", end_time="16:00", course_name="Yazılım Proje Yönetimi", room="E502", instructor="Öğr. Gör. Selin Arslan"),
            CourseSchedule(department_id=dept_ym.id, day="Çarşamba", start_time="09:00", end_time="11:00", course_name="Yapay Zeka ve Makine Öğrenmesi", room="D403", instructor="Prof. Dr. Can Öztürk"),
            CourseSchedule(department_id=dept_ym.id, day="Perşembe", start_time="10:00", end_time="12:00", course_name="Bulut Bilişim ve DevOps", room="E503", instructor="Doç. Dr. Zeynep Aydın"),
            CourseSchedule(department_id=dept_ym.id, day="Perşembe", start_time="13:00", end_time="15:00", course_name="Siber Güvenlik", room="D404", instructor="Dr. Öğr. Üyesi Emre Şahin"),
            CourseSchedule(department_id=dept_ym.id, day="Cuma", start_time="09:00", end_time="11:00", course_name="Büyük Veri ve Analitik", room="E504", instructor="Öğr. Gör. Selin Arslan"),
        ]
        
        all_schedules = bp_schedules + ym_schedules
        for schedule in all_schedules:
            await db.course_schedules.insert_one(schedule.model_dump())
        logging.info("Course schedules created")
    
    # Create academic calendar if doesn't exist
    existing_calendar = await db.academic_calendar.count_documents({})
    if existing_calendar == 0:
        calendar_events = [
            # Güz Dönemi 2024-2025
            AcademicCalendar(title="Güz Dönemi Kayıt", start_date="2024-09-16", end_date="2024-09-27", semester="Güz", year="2024-2025", description="Güz dönemi öğrenci kayıt işlemleri", order=1),
            AcademicCalendar(title="Güz Dönemi Ders Başlangıcı", start_date="2024-10-01", end_date="2024-10-01", semester="Güz", year="2024-2025", description="Güz dönemi derslerinin başlangıcı", order=2),
            AcademicCalendar(title="Ara Sınav Dönemi", start_date="2024-11-18", end_date="2024-11-29", semester="Güz", year="2024-2025", description="Güz dönemi ara sınav haftası", order=3),
            AcademicCalendar(title="Yarıyıl Tatili", start_date="2025-01-27", end_date="2025-02-02", semester="Güz", year="2024-2025", description="Yarıyıl tatili", order=4),
            AcademicCalendar(title="Final Sınav Dönemi", start_date="2025-01-13", end_date="2025-01-24", semester="Güz", year="2024-2025", description="Güz dönemi final sınav haftası", order=5),
            AcademicCalendar(title="Bütünleme Sınav Dönemi", start_date="2025-02-03", end_date="2025-02-07", semester="Güz", year="2024-2025", description="Güz dönemi bütünleme sınav haftası", order=6),
            
            # Bahar Dönemi 2024-2025
            AcademicCalendar(title="Bahar Dönemi Kayıt", start_date="2025-02-10", end_date="2025-02-21", semester="Bahar", year="2024-2025", description="Bahar dönemi öğrenci kayıt işlemleri", order=7),
            AcademicCalendar(title="Bahar Dönemi Ders Başlangıcı", start_date="2025-02-24", end_date="2025-02-24", semester="Bahar", year="2024-2025", description="Bahar dönemi derslerinin başlangıcı", order=8),
            AcademicCalendar(title="Ulusal Egemenlik ve Çocuk Bayramı", start_date="2025-04-23", end_date="2025-04-23", semester="Bahar", year="2024-2025", description="Resmi tatil", order=9),
            AcademicCalendar(title="Ara Sınav Dönemi", start_date="2025-04-14", end_date="2025-04-25", semester="Bahar", year="2024-2025", description="Bahar dönemi ara sınav haftası", order=10),
            AcademicCalendar(title="Emek ve Dayanışma Günü", start_date="2025-05-01", end_date="2025-05-01", semester="Bahar", year="2024-2025", description="Resmi tatil", order=11),
            AcademicCalendar(title="Ramazan Bayramı", start_date="2025-03-30", end_date="2025-04-01", semester="Bahar", year="2024-2025", description="Resmi tatil", order=12),
            AcademicCalendar(title="Final Sınav Dönemi", start_date="2025-06-02", end_date="2025-06-13", semester="Bahar", year="2024-2025", description="Bahar dönemi final sınav haftası", order=13),
            AcademicCalendar(title="Bütünleme Sınav Dönemi", start_date="2025-06-16", end_date="2025-06-20", semester="Bahar", year="2024-2025", description="Bahar dönemi bütünleme sınav haftası", order=14),
        ]
        
        for event in calendar_events:
            await db.academic_calendar.insert_one(event.model_dump())
        logging.info("Academic calendar created")
    
    # Create sample student if doesn't exist
    existing_students = await db.students.count_documents({})
    if existing_students == 0:
        # Create sample student
        sample_student = Student(
            student_no="2025001",
            tc_no="12345678901",
            first_name="Ahmet",
            last_name="Yılmaz",
            email="ahmet.yilmaz@student.ata.edu.tr",
            phone="0555 123 45 67",
            department="Bilgisayar Programcılığı",
            class_level="2",
            password=get_password_hash("123456"),
            status="approved",
            gpa=3.25
        )
        student_doc = sample_student.model_dump()
        await db.students.insert_one(student_doc)
        logging.info("Sample student created: 2025001 / 123456")
        
        # Create sample grades for the student
        sample_grades = [
            StudentGrade(
                student_id=sample_student.id,
                course_name="Programlama Temelleri",
                course_code="BP101",
                credit=4,
                midterm=85,
                final=90,
                grade="AA",
                semester="Güz 2024"
            ),
            StudentGrade(
                student_id=sample_student.id,
                course_name="Veri Yapıları",
                course_code="BP102",
                credit=3,
                midterm=78,
                final=82,
                grade="BA",
                semester="Güz 2024"
            ),
            StudentGrade(
                student_id=sample_student.id,
                course_name="Veritabanı Yönetimi",
                course_code="BP201",
                credit=3,
                midterm=88,
                final=92,
                grade="AA",
                semester="Bahar 2025"
            ),
            StudentGrade(
                student_id=sample_student.id,
                course_name="Web Programlama",
                course_code="BP202",
                credit=3,
                midterm=75,
                final=80,
                grade="BB",
                semester="Bahar 2025"
            ),
        ]
        
        for grade in sample_grades:
            await db.student_grades.insert_one(grade.model_dump())
        logging.info("Sample grades created")
        
        # Create sample attendance records
        sample_attendance = [
            StudentAttendance(
                student_id=sample_student.id,
                course_name="Programlama Temelleri",
                total_hours=56,
                attended_hours=52,
                absence_percentage=7.14
            ),
            StudentAttendance(
                student_id=sample_student.id,
                course_name="Veri Yapıları",
                total_hours=42,
                attended_hours=38,
                absence_percentage=9.52
            ),
            StudentAttendance(
                student_id=sample_student.id,
                course_name="Veritabanı Yönetimi",
                total_hours=42,
                attended_hours=42,
                absence_percentage=0.0
            ),
        ]
        
        for attendance in sample_attendance:
            await db.student_attendance.insert_one(attendance.model_dump())
        logging.info("Sample attendance records created")

# Auth endpoints
@api_router.post("/auth/login", response_model=Token)
async def login(user_input: UserLogin):
    # Try to find user by username or email
    user = await db.users.find_one({
        "$or": [
            {"username": user_input.username},
            {"email": user_input.username}
        ]
    }, {"_id": 0})
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not verify_password(user_input.password, user['password']):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token(data={"sub": user['username']})
    user.pop('password')
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        user=User(**user)
    )

# News endpoints
@api_router.get("/news", response_model=List[News])
async def get_news():
    news_list = await db.news.find({}, {"_id": 0}).sort("published_date", -1).to_list(1000)
    return news_list

@api_router.get("/news/{news_id}", response_model=News)
async def get_news_by_id(news_id: str):
    news = await db.news.find_one({"id": news_id}, {"_id": 0})
    if not news:
        raise HTTPException(status_code=404, detail="News not found")
    return news

@api_router.post("/news", response_model=News)
async def create_news(news_input: NewsCreate, current_user: User = Depends(get_current_user)):
    news_obj = News(**news_input.model_dump())
    doc = news_obj.model_dump()
    await db.news.insert_one(doc)
    return news_obj

@api_router.put("/news/{news_id}", response_model=News)
async def update_news(news_id: str, news_input: NewsCreate, current_user: User = Depends(get_current_user)):
    existing_news = await db.news.find_one({"id": news_id})
    if not existing_news:
        raise HTTPException(status_code=404, detail="News not found")
    
    update_data = news_input.model_dump()
    await db.news.update_one({"id": news_id}, {"$set": update_data})
    
    updated_news = await db.news.find_one({"id": news_id}, {"_id": 0})
    return News(**updated_news)

@api_router.delete("/news/{news_id}")
async def delete_news(news_id: str, current_user: User = Depends(get_current_user)):
    result = await db.news.delete_one({"id": news_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="News not found")
    return {"message": "News deleted successfully"}

# Announcements endpoints
@api_router.get("/announcements", response_model=List[Announcement])
async def get_announcements():
    announcements = await db.announcements.find({"is_active": True}, {"_id": 0}).sort("published_date", -1).to_list(1000)
    return announcements

@api_router.post("/announcements", response_model=Announcement)
async def create_announcement(announcement_input: AnnouncementCreate, current_user: User = Depends(get_current_user)):
    announcement_obj = Announcement(**announcement_input.model_dump())
    doc = announcement_obj.model_dump()
    await db.announcements.insert_one(doc)
    return announcement_obj

@api_router.put("/announcements/{announcement_id}", response_model=Announcement)
async def update_announcement(announcement_id: str, announcement_input: AnnouncementCreate, current_user: User = Depends(get_current_user)):
    existing = await db.announcements.find_one({"id": announcement_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Announcement not found")
    
    update_data = announcement_input.model_dump()
    await db.announcements.update_one({"id": announcement_id}, {"$set": update_data})
    
    updated = await db.announcements.find_one({"id": announcement_id}, {"_id": 0})
    return Announcement(**updated)

@api_router.delete("/announcements/{announcement_id}")
async def delete_announcement(announcement_id: str, current_user: User = Depends(get_current_user)):
    result = await db.announcements.delete_one({"id": announcement_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Announcement not found")
    return {"message": "Announcement deleted successfully"}

# Events endpoints
@api_router.get("/events", response_model=List[Event])
async def get_events():
    events = await db.events.find({}, {"_id": 0}).sort("event_date", -1).to_list(1000)
    return events

@api_router.get("/events/{event_id}", response_model=Event)
async def get_event_by_id(event_id: str):
    event = await db.events.find_one({"id": event_id}, {"_id": 0})
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event

@api_router.post("/events", response_model=Event)
async def create_event(event_input: EventCreate, current_user: User = Depends(get_current_user)):
    event_obj = Event(**event_input.model_dump())
    doc = event_obj.model_dump()
    await db.events.insert_one(doc)
    return event_obj

@api_router.put("/events/{event_id}", response_model=Event)
async def update_event(event_id: str, event_input: EventCreate, current_user: User = Depends(get_current_user)):
    existing = await db.events.find_one({"id": event_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Event not found")
    
    update_data = event_input.model_dump()
    await db.events.update_one({"id": event_id}, {"$set": update_data})
    
    updated = await db.events.find_one({"id": event_id}, {"_id": 0})
    return Event(**updated)

@api_router.delete("/events/{event_id}")
async def delete_event(event_id: str, current_user: User = Depends(get_current_user)):
    result = await db.events.delete_one({"id": event_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Event not found")
    return {"message": "Event deleted successfully"}

# Academic Units endpoints
@api_router.get("/academic-units", response_model=List[AcademicUnit])
async def get_academic_units(unit_type: Optional[str] = None):
    query = {"type": unit_type} if unit_type else {}
    units = await db.academic_units.find(query, {"_id": 0}).to_list(1000)
    return units

@api_router.get("/academic-units/{unit_id}", response_model=AcademicUnit)
async def get_academic_unit_by_id(unit_id: str):
    unit = await db.academic_units.find_one({"id": unit_id}, {"_id": 0})
    if not unit:
        raise HTTPException(status_code=404, detail="Academic unit not found")
    return unit

@api_router.post("/academic-units", response_model=AcademicUnit)
async def create_academic_unit(unit_input: AcademicUnitCreate, current_user: User = Depends(get_current_user)):
    unit_obj = AcademicUnit(**unit_input.model_dump())
    doc = unit_obj.model_dump()
    await db.academic_units.insert_one(doc)
    return unit_obj

@api_router.put("/academic-units/{unit_id}", response_model=AcademicUnit)
async def update_academic_unit(unit_id: str, unit_input: AcademicUnitCreate, current_user: User = Depends(get_current_user)):
    existing = await db.academic_units.find_one({"id": unit_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Academic unit not found")
    
    update_data = unit_input.model_dump()
    await db.academic_units.update_one({"id": unit_id}, {"$set": update_data})
    
    updated = await db.academic_units.find_one({"id": unit_id}, {"_id": 0})
    return AcademicUnit(**updated)

@api_router.delete("/academic-units/{unit_id}")
async def delete_academic_unit(unit_id: str, current_user: User = Depends(get_current_user)):
    result = await db.academic_units.delete_one({"id": unit_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Academic unit not found")
    return {"message": "Academic unit deleted successfully"}

# Slider endpoints
@api_router.get("/slider", response_model=List[SliderImage])
async def get_slider_images():
    images = await db.slider_images.find({"is_active": True}, {"_id": 0}).sort("order", 1).to_list(1000)
    return images

@api_router.post("/slider", response_model=SliderImage)
async def create_slider_image(slider_input: SliderImageCreate, current_user: User = Depends(get_current_user)):
    slider_obj = SliderImage(**slider_input.model_dump())
    doc = slider_obj.model_dump()
    await db.slider_images.insert_one(doc)
    return slider_obj

@api_router.put("/slider/{slider_id}", response_model=SliderImage)
async def update_slider_image(slider_id: str, slider_input: SliderImageCreate, current_user: User = Depends(get_current_user)):
    existing = await db.slider_images.find_one({"id": slider_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Slider image not found")
    
    update_data = slider_input.model_dump()
    await db.slider_images.update_one({"id": slider_id}, {"$set": update_data})
    
    updated = await db.slider_images.find_one({"id": slider_id}, {"_id": 0})
    return SliderImage(**updated)

@api_router.delete("/slider/{slider_id}")
async def delete_slider_image(slider_id: str, current_user: User = Depends(get_current_user)):
    result = await db.slider_images.delete_one({"id": slider_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Slider image not found")
    return {"message": "Slider image deleted successfully"}

# Contact endpoints
@api_router.get("/contact", response_model=ContactInfo)
async def get_contact_info():
    contact = await db.contact_info.find_one({}, {"_id": 0})
    if not contact:
        # Return default contact info
        return ContactInfo(
            address="ATA Üniversitesi, Merkez Kampüs",
            phone="+90 123 456 7890",
            email="info@ata.edu.tr",
            map_lat=39.9334,
            map_lng=32.8597,
            social_media={}
        )
    return ContactInfo(**contact)

@api_router.put("/contact", response_model=ContactInfo)
async def update_contact_info(contact_input: ContactInfoUpdate, current_user: User = Depends(get_current_user)):
    existing = await db.contact_info.find_one({})
    
    contact_obj = ContactInfo(**contact_input.model_dump())
    doc = contact_obj.model_dump()
    
    if existing:
        await db.contact_info.update_one({"id": existing['id']}, {"$set": doc})
    else:
        await db.contact_info.insert_one(doc)
    
    return contact_obj

# Quick Links endpoints
@api_router.get("/quick-links", response_model=List[QuickLink])
async def get_quick_links():
    links = await db.quick_links.find({"is_active": True}, {"_id": 0}).sort("order", 1).to_list(1000)
    return links

@api_router.post("/quick-links", response_model=QuickLink)
async def create_quick_link(link_input: QuickLinkCreate, current_user: User = Depends(get_current_user)):
    link_obj = QuickLink(**link_input.model_dump())
    doc = link_obj.model_dump()
    await db.quick_links.insert_one(doc)
    return link_obj

@api_router.put("/quick-links/{link_id}", response_model=QuickLink)
async def update_quick_link(link_id: str, link_input: QuickLinkCreate, current_user: User = Depends(get_current_user)):
    existing = await db.quick_links.find_one({"id": link_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Quick link not found")
    
    update_data = link_input.model_dump()
    await db.quick_links.update_one({"id": link_id}, {"$set": update_data})
    
    updated = await db.quick_links.find_one({"id": link_id}, {"_id": 0})
    return QuickLink(**updated)

@api_router.delete("/quick-links/{link_id}")
async def delete_quick_link(link_id: str, current_user: User = Depends(get_current_user)):
    result = await db.quick_links.delete_one({"id": link_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Quick link not found")
    return {"message": "Quick link deleted successfully"}

# Settings endpoints
@api_router.get("/settings", response_model=Settings)
async def get_settings():
    settings = await db.settings.find_one({}, {"_id": 0})
    if not settings:
        # Return default settings
        default_settings = Settings()
        await db.settings.insert_one(default_settings.model_dump())
        return default_settings
    return Settings(**settings)

@api_router.put("/settings", response_model=Settings)
async def update_settings(settings_input: SettingsUpdate, current_user: User = Depends(get_current_user)):
    existing = await db.settings.find_one({})
    
    if existing:
        update_data = settings_input.model_dump()
        update_data['updated_at'] = datetime.now(timezone.utc).isoformat()
        await db.settings.update_one({"id": existing['id']}, {"$set": update_data})
        updated = await db.settings.find_one({"id": existing['id']}, {"_id": 0})
        return Settings(**updated)
    else:
        settings_obj = Settings(**settings_input.model_dump())
        doc = settings_obj.model_dump()
        await db.settings.insert_one(doc)
        return settings_obj

# Contact Messages endpoints
@api_router.get("/contact-messages", response_model=List[ContactMessage])
async def get_contact_messages(current_user: User = Depends(get_current_user)):
    messages = await db.contact_messages.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return messages

@api_router.post("/contact-messages", response_model=ContactMessage)
async def create_contact_message(message_input: ContactMessageCreate):
    message_obj = ContactMessage(**message_input.model_dump())
    doc = message_obj.model_dump()
    await db.contact_messages.insert_one(doc)
    return message_obj

@api_router.put("/contact-messages/{message_id}/read", response_model=ContactMessage)
async def mark_message_read(message_id: str, current_user: User = Depends(get_current_user)):
    existing = await db.contact_messages.find_one({"id": message_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Message not found")
    
    await db.contact_messages.update_one({"id": message_id}, {"$set": {"is_read": True}})
    updated = await db.contact_messages.find_one({"id": message_id}, {"_id": 0})
    return ContactMessage(**updated)

@api_router.delete("/contact-messages/{message_id}")
async def delete_contact_message(message_id: str, current_user: User = Depends(get_current_user)):
    result = await db.contact_messages.delete_one({"id": message_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Message not found")
    return {"message": "Contact message deleted successfully"}

# User Management endpoints (Admin only)
@api_router.get("/users", response_model=List[User])
async def get_users(current_admin: User = Depends(get_current_admin)):
    users = await db.users.find({}, {"_id": 0, "password": 0}).sort("created_at", -1).to_list(1000)
    return [User(**user) for user in users]

@api_router.get("/users/{user_id}", response_model=User)
async def get_user_by_id(user_id: str, current_admin: User = Depends(get_current_admin)):
    user = await db.users.find_one({"id": user_id}, {"_id": 0, "password": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return User(**user)

@api_router.post("/users", response_model=User)
async def create_user(user_input: UserCreate, current_admin: User = Depends(get_current_admin)):
    existing_user = await db.users.find_one({"username": user_input.username})
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    existing_email = await db.users.find_one({"email": user_input.email})
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already exists")
    
    hashed_password = get_password_hash(user_input.password)
    user_dict = user_input.model_dump()
    user_dict.pop('password')
    user_obj = User(**user_dict)
    
    doc = user_obj.model_dump()
    doc['password'] = hashed_password
    
    await db.users.insert_one(doc)
    return user_obj

@api_router.put("/users/{user_id}", response_model=User)
async def update_user(user_id: str, user_input: UserUpdate, current_admin: User = Depends(get_current_admin)):
    existing_user = await db.users.find_one({"id": user_id})
    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Prevent editing default admin user
    if existing_user.get("username") == "admin":
        raise HTTPException(status_code=403, detail="Default admin user cannot be edited")
    
    update_data = {}
    if user_input.username is not None:
        # Check if username is already taken by another user
        username_check = await db.users.find_one({"username": user_input.username, "id": {"$ne": user_id}})
        if username_check:
            raise HTTPException(status_code=400, detail="Username already exists")
        update_data["username"] = user_input.username
    
    if user_input.email is not None:
        # Check if email is already taken by another user
        email_check = await db.users.find_one({"email": user_input.email, "id": {"$ne": user_id}})
        if email_check:
            raise HTTPException(status_code=400, detail="Email already exists")
        update_data["email"] = user_input.email
    
    if user_input.full_name is not None:
        update_data["full_name"] = user_input.full_name
    
    if user_input.role is not None:
        update_data["role"] = user_input.role
    
    if user_input.password is not None:
        update_data["password"] = get_password_hash(user_input.password)
    
    if update_data:
        await db.users.update_one({"id": user_id}, {"$set": update_data})
    
    updated_user = await db.users.find_one({"id": user_id}, {"_id": 0, "password": 0})
    return User(**updated_user)

@api_router.delete("/users/{user_id}")
async def delete_user(user_id: str, current_admin: User = Depends(get_current_admin)):
    # Get user to check if it's default admin
    user_to_delete = await db.users.find_one({"id": user_id})
    if not user_to_delete:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Prevent deleting default admin user
    if user_to_delete.get("username") == "admin":
        raise HTTPException(status_code=403, detail="Default admin user cannot be deleted")
    
    # Prevent deleting self
    if current_admin.id == user_id:
        raise HTTPException(status_code=400, detail="Cannot delete your own account")
    
    result = await db.users.delete_one({"id": user_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted successfully"}

# Footer Settings endpoints
@api_router.get("/footer-settings")
async def get_footer_settings():
    settings = await db.footer_settings.find_one({}, {"_id": 0})
    if not settings:
        # Create default settings
        default_settings = FooterSettings()
        await db.footer_settings.insert_one(default_settings.model_dump())
        return default_settings
    return FooterSettings(**settings)

@api_router.put("/footer-settings")
async def update_footer_settings(settings_input: FooterSettingsUpdate, current_admin: User = Depends(get_current_admin)):
    existing_settings = await db.footer_settings.find_one({})
    
    if not existing_settings:
        # Create new settings
        new_settings = FooterSettings(**settings_input.model_dump(exclude_none=True))
        await db.footer_settings.insert_one(new_settings.model_dump())
        return new_settings
    
    # Update existing settings
    update_data = settings_input.model_dump(exclude_none=True)
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    await db.footer_settings.update_one(
        {"id": existing_settings["id"]},
        {"$set": update_data}
    )
    
    updated = await db.footer_settings.find_one({"id": existing_settings["id"]}, {"_id": 0})
    return FooterSettings(**updated)

# Footer Links endpoints
@api_router.get("/footer-links", response_model=List[FooterLink])
async def get_footer_links(category: Optional[str] = None):
    query = {"category": category} if category else {}
    links = await db.footer_links.find(query, {"_id": 0}).sort("order", 1).to_list(1000)
    return [FooterLink(**link) for link in links]

@api_router.get("/footer-links/{link_id}", response_model=FooterLink)
async def get_footer_link_by_id(link_id: str):
    link = await db.footer_links.find_one({"id": link_id}, {"_id": 0})
    if not link:
        raise HTTPException(status_code=404, detail="Footer link not found")
    return FooterLink(**link)

@api_router.post("/footer-links", response_model=FooterLink)
async def create_footer_link(link_input: FooterLinkCreate, current_admin: User = Depends(get_current_admin)):
    link_obj = FooterLink(**link_input.model_dump())
    doc = link_obj.model_dump()
    await db.footer_links.insert_one(doc)
    return link_obj

@api_router.put("/footer-links/{link_id}", response_model=FooterLink)
async def update_footer_link(link_id: str, link_input: FooterLinkCreate, current_admin: User = Depends(get_current_admin)):
    existing_link = await db.footer_links.find_one({"id": link_id})
    if not existing_link:
        raise HTTPException(status_code=404, detail="Footer link not found")
    
    update_data = link_input.model_dump()
    await db.footer_links.update_one({"id": link_id}, {"$set": update_data})
    
    updated_link = await db.footer_links.find_one({"id": link_id}, {"_id": 0})
    return FooterLink(**updated_link)

@api_router.delete("/footer-links/{link_id}")
async def delete_footer_link(link_id: str, current_admin: User = Depends(get_current_admin)):
    result = await db.footer_links.delete_one({"id": link_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Footer link not found")
    return {"message": "Footer link deleted successfully"}

# Academic Staff endpoints
@api_router.get("/academic-staff", response_model=List[AcademicStaff])
async def get_academic_staff():
    staff = await db.academic_staff.find({}, {"_id": 0}).sort("order", 1).to_list(length=None)
    return [AcademicStaff(**s) for s in staff]

@api_router.get("/academic-staff/{staff_id}", response_model=AcademicStaff)
async def get_academic_staff_by_id(staff_id: str):
    staff = await db.academic_staff.find_one({"id": staff_id}, {"_id": 0})
    if not staff:
        raise HTTPException(status_code=404, detail="Academic staff not found")
    return AcademicStaff(**staff)

@api_router.post("/academic-staff", response_model=AcademicStaff)
async def create_academic_staff(staff_data: AcademicStaffCreate, current_user: User = Depends(get_current_admin)):
    new_staff = AcademicStaff(**staff_data.model_dump())
    await db.academic_staff.insert_one(new_staff.model_dump())
    return new_staff

@api_router.put("/academic-staff/{staff_id}", response_model=AcademicStaff)
async def update_academic_staff(staff_id: str, staff_data: AcademicStaffUpdate, current_user: User = Depends(get_current_admin)):
    staff = await db.academic_staff.find_one({"id": staff_id}, {"_id": 0})
    if not staff:
        raise HTTPException(status_code=404, detail="Academic staff not found")
    
    update_data = {k: v for k, v in staff_data.model_dump().items() if v is not None}
    if update_data:
        await db.academic_staff.update_one({"id": staff_id}, {"$set": update_data})
    
    updated_staff = await db.academic_staff.find_one({"id": staff_id}, {"_id": 0})
    return AcademicStaff(**updated_staff)

@api_router.delete("/academic-staff/{staff_id}")
async def delete_academic_staff(staff_id: str, current_user: User = Depends(get_current_admin)):
    result = await db.academic_staff.delete_one({"id": staff_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Academic staff not found")
    return {"message": "Academic staff deleted successfully"}

# Academic Calendar endpoints
@api_router.get("/academic-calendar", response_model=List[AcademicCalendar])
async def get_academic_calendar():
    calendar = await db.academic_calendar.find({}, {"_id": 0}).sort("order", 1).to_list(length=None)
    return [AcademicCalendar(**c) for c in calendar]

@api_router.get("/academic-calendar/{calendar_id}", response_model=AcademicCalendar)
async def get_academic_calendar_by_id(calendar_id: str):
    calendar = await db.academic_calendar.find_one({"id": calendar_id}, {"_id": 0})
    if not calendar:
        raise HTTPException(status_code=404, detail="Calendar event not found")
    return AcademicCalendar(**calendar)

@api_router.post("/academic-calendar", response_model=AcademicCalendar)
async def create_academic_calendar(calendar_data: AcademicCalendarCreate, current_user: User = Depends(get_current_admin)):
    new_calendar = AcademicCalendar(**calendar_data.model_dump())
    await db.academic_calendar.insert_one(new_calendar.model_dump())
    return new_calendar

@api_router.put("/academic-calendar/{calendar_id}", response_model=AcademicCalendar)
async def update_academic_calendar(calendar_id: str, calendar_data: AcademicCalendarUpdate, current_user: User = Depends(get_current_admin)):
    calendar = await db.academic_calendar.find_one({"id": calendar_id}, {"_id": 0})
    if not calendar:
        raise HTTPException(status_code=404, detail="Calendar event not found")
    
    update_data = {k: v for k, v in calendar_data.model_dump().items() if v is not None}
    if update_data:
        await db.academic_calendar.update_one({"id": calendar_id}, {"$set": update_data})
    
    updated_calendar = await db.academic_calendar.find_one({"id": calendar_id}, {"_id": 0})
    return AcademicCalendar(**updated_calendar)

@api_router.delete("/academic-calendar/{calendar_id}")
async def delete_academic_calendar(calendar_id: str, current_user: User = Depends(get_current_admin)):
    result = await db.academic_calendar.delete_one({"id": calendar_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Calendar event not found")
    return {"message": "Calendar event deleted successfully"}

# Course Department endpoints
@api_router.get("/course-departments", response_model=List[CourseDepartment])
async def get_course_departments():
    departments = await db.course_departments.find({}, {"_id": 0}).sort("order", 1).to_list(length=None)
    return [CourseDepartment(**d) for d in departments]

@api_router.get("/course-departments/{department_id}", response_model=CourseDepartment)
async def get_course_department_by_id(department_id: str):
    department = await db.course_departments.find_one({"id": department_id}, {"_id": 0})
    if not department:
        raise HTTPException(status_code=404, detail="Department not found")
    return CourseDepartment(**department)

@api_router.post("/course-departments", response_model=CourseDepartment)
async def create_course_department(department_data: CourseDepartmentCreate, current_user: User = Depends(get_current_admin)):
    new_department = CourseDepartment(**department_data.model_dump())
    await db.course_departments.insert_one(new_department.model_dump())
    return new_department

@api_router.put("/course-departments/{department_id}", response_model=CourseDepartment)
async def update_course_department(department_id: str, department_data: CourseDepartmentUpdate, current_user: User = Depends(get_current_admin)):
    department = await db.course_departments.find_one({"id": department_id}, {"_id": 0})
    if not department:
        raise HTTPException(status_code=404, detail="Department not found")
    
    update_data = {k: v for k, v in department_data.model_dump().items() if v is not None}
    if update_data:
        await db.course_departments.update_one({"id": department_id}, {"$set": update_data})
    
    updated_department = await db.course_departments.find_one({"id": department_id}, {"_id": 0})
    return CourseDepartment(**updated_department)

@api_router.delete("/course-departments/{department_id}")
async def delete_course_department(department_id: str, current_user: User = Depends(get_current_admin)):
    # Also delete all schedules for this department
    await db.course_schedules.delete_many({"department_id": department_id})
    
    result = await db.course_departments.delete_one({"id": department_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Department not found")
    return {"message": "Department and its schedules deleted successfully"}

# Course Schedule endpoints
@api_router.get("/course-schedules", response_model=List[CourseSchedule])
async def get_course_schedules(department_id: Optional[str] = None):
    query = {"department_id": department_id} if department_id else {}
    schedules = await db.course_schedules.find(query, {"_id": 0}).to_list(length=None)
    return [CourseSchedule(**s) for s in schedules]

@api_router.get("/course-schedules/{schedule_id}", response_model=CourseSchedule)
async def get_course_schedule_by_id(schedule_id: str):
    schedule = await db.course_schedules.find_one({"id": schedule_id}, {"_id": 0})
    if not schedule:
        raise HTTPException(status_code=404, detail="Course schedule not found")
    return CourseSchedule(**schedule)

@api_router.post("/course-schedules", response_model=CourseSchedule)
async def create_course_schedule(schedule_data: CourseScheduleCreate, current_user: User = Depends(get_current_admin)):
    new_schedule = CourseSchedule(**schedule_data.model_dump())
    await db.course_schedules.insert_one(new_schedule.model_dump())
    return new_schedule

@api_router.put("/course-schedules/{schedule_id}", response_model=CourseSchedule)
async def update_course_schedule(schedule_id: str, schedule_data: CourseScheduleUpdate, current_user: User = Depends(get_current_admin)):
    schedule = await db.course_schedules.find_one({"id": schedule_id}, {"_id": 0})
    if not schedule:
        raise HTTPException(status_code=404, detail="Course schedule not found")
    
    update_data = {k: v for k, v in schedule_data.model_dump().items() if v is not None}
    if update_data:
        await db.course_schedules.update_one({"id": schedule_id}, {"$set": update_data})
    
    updated_schedule = await db.course_schedules.find_one({"id": schedule_id}, {"_id": 0})
    return CourseSchedule(**updated_schedule)

@api_router.delete("/course-schedules/{schedule_id}")
async def delete_course_schedule(schedule_id: str, current_user: User = Depends(get_current_admin)):
    result = await db.course_schedules.delete_one({"id": schedule_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Course schedule not found")
    return {"message": "Course schedule deleted successfully"}

# Contact Page Settings endpoints
@api_router.get("/contact-page-settings", response_model=ContactPageSettings)
async def get_contact_page_settings():
    settings = await db.contact_page_settings.find_one({}, {"_id": 0})
    if not settings:
        # Return default if not exists
        return ContactPageSettings()
    return ContactPageSettings(**settings)

@api_router.put("/contact-page-settings", response_model=ContactPageSettings)
async def update_contact_page_settings(settings_data: ContactPageSettingsUpdate, current_user: User = Depends(get_current_admin)):
    existing = await db.contact_page_settings.find_one({}, {"_id": 0})
    
    if not existing:
        # Create new settings
        new_settings = ContactPageSettings(**settings_data.model_dump(exclude_none=True))
        await db.contact_page_settings.insert_one(new_settings.model_dump())
        return new_settings
    
    # Update existing
    update_data = {k: v for k, v in settings_data.model_dump().items() if v is not None}
    update_data['updated_at'] = datetime.now(timezone.utc).isoformat()
    
    if update_data:
        await db.contact_page_settings.update_one({"id": existing['id']}, {"$set": update_data})
    
    updated = await db.contact_page_settings.find_one({"id": existing['id']}, {"_id": 0})
    return ContactPageSettings(**updated)

# About Settings endpoints
@api_router.get("/about-settings", response_model=AboutSettings)
async def get_about_settings():
    settings = await db.about_settings.find_one({}, {"_id": 0})
    if not settings:
        # Return default if not exists
        return AboutSettings()
    return AboutSettings(**settings)

@api_router.put("/about-settings", response_model=AboutSettings)
async def update_about_settings(settings_data: AboutSettingsUpdate, current_user: User = Depends(get_current_admin)):
    existing = await db.about_settings.find_one({}, {"_id": 0})
    
    if not existing:
        # Create new settings
        new_settings = AboutSettings(**settings_data.model_dump(exclude_none=True))
        await db.about_settings.insert_one(new_settings.model_dump())
        return new_settings
    
    # Update existing
    update_data = {k: v for k, v in settings_data.model_dump().items() if v is not None}
    update_data['updated_at'] = datetime.now(timezone.utc).isoformat()
    
    if update_data:
        await db.about_settings.update_one({"id": existing['id']}, {"$set": update_data})
    
    updated = await db.about_settings.find_one({"id": existing['id']}, {"_id": 0})
    return AboutSettings(**updated)

# Student endpoints
@api_router.post("/students/register", response_model=Student)
async def register_student(student_data: StudentRegister):
    # Check if TC No already exists
    existing = await db.students.find_one({"tc_no": student_data.tc_no}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="Bu TC No ile kayıtlı öğrenci zaten var")
    
    # Generate student number
    year = datetime.now().year
    count = await db.students.count_documents({"student_no": {"$regex": f"^{year}"}})
    student_no = f"{year}{str(count + 1).zfill(4)}"
    
    # Hash password
    hashed_pw = get_password_hash(student_data.password)
    
    # Create student
    new_student = Student(
        student_no=student_no,
        tc_no=student_data.tc_no,
        first_name=student_data.first_name,
        last_name=student_data.last_name,
        email=student_data.email,
        phone=student_data.phone,
        department=student_data.department,
        class_level=student_data.class_level,
        password=hashed_pw,
        status="pending"
    )
    
    await db.students.insert_one(new_student.model_dump())
    return new_student

@api_router.post("/students/login")
async def student_login(credentials: StudentLogin):
    student = await db.students.find_one({"student_no": credentials.student_no}, {"_id": 0})
    
    if not student:
        raise HTTPException(status_code=401, detail="Öğrenci numarası veya şifre hatalı")
    
    if student['status'] != 'approved':
        raise HTTPException(status_code=403, detail="Hesabınız henüz onaylanmamış")
    
    if not verify_password(credentials.password, student['password']):
        raise HTTPException(status_code=401, detail="Öğrenci numarası veya şifre hatalı")
    
    # Create access token
    access_token = create_access_token(data={"sub": student['student_no'], "type": "student"})
    
    # Remove password before creating Student object
    student_data = {k: v for k, v in student.items() if k != 'password'}
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "student": student_data
    }

# Current student dependency
async def get_current_student(credentials: HTTPAuthorizationCredentials = Depends(security)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Oturum açmanız gerekiyor",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        student_no: str = payload.get("sub")
        token_type: str = payload.get("type")
        
        if student_no is None or token_type != "student":
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception
    
    student = await db.students.find_one({"student_no": student_no}, {"_id": 0})
    if student is None:
        raise credentials_exception
    
    return Student(**student)

@api_router.get("/students/me", response_model=Student)
async def get_current_student_info(current_student: Student = Depends(get_current_student)):
    return current_student

@api_router.get("/students", response_model=List[Student])
async def get_all_students(current_user: User = Depends(get_current_admin)):
    students = await db.students.find({}, {"_id": 0}).to_list(length=None)
    return [Student(**s) for s in students]

@api_router.get("/students/{student_id}", response_model=Student)
async def get_student(student_id: str, current_user: User = Depends(get_current_admin)):
    student = await db.students.find_one({"id": student_id}, {"_id": 0})
    if not student:
        raise HTTPException(status_code=404, detail="Öğrenci bulunamadı")
    return Student(**student)

@api_router.put("/students/{student_id}/approve")
async def approve_student(student_id: str, current_user: User = Depends(get_current_admin)):
    student = await db.students.find_one({"id": student_id}, {"_id": 0})
    if not student:
        raise HTTPException(status_code=404, detail="Öğrenci bulunamadı")
    
    await db.students.update_one(
        {"id": student_id},
        {"$set": {
            "status": "approved",
            "approved_at": datetime.now(timezone.utc).isoformat(),
            "approved_by": current_user.username
        }}
    )
    
    return {"message": "Öğrenci onaylandı"}

@api_router.put("/students/{student_id}/reject")
async def reject_student(student_id: str, current_user: User = Depends(get_current_admin)):
    student = await db.students.find_one({"id": student_id}, {"_id": 0})
    if not student:
        raise HTTPException(status_code=404, detail="Öğrenci bulunamadı")
    
    await db.students.update_one(
        {"id": student_id},
        {"$set": {"status": "rejected"}}
    )
    
    return {"message": "Öğrenci reddedildi"}

@api_router.put("/students/{student_id}", response_model=Student)
async def update_student(student_id: str, student_data: StudentUpdate, current_user: User = Depends(get_current_admin)):
    student = await db.students.find_one({"id": student_id}, {"_id": 0})
    if not student:
        raise HTTPException(status_code=404, detail="Öğrenci bulunamadı")
    
    update_data = {k: v for k, v in student_data.model_dump().items() if v is not None}
    if update_data:
        await db.students.update_one({"id": student_id}, {"$set": update_data})
    
    updated = await db.students.find_one({"id": student_id}, {"_id": 0})
    return Student(**updated)

@api_router.delete("/students/{student_id}")
async def delete_student(student_id: str, current_user: User = Depends(get_current_admin)):
    result = await db.students.delete_one({"id": student_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Öğrenci bulunamadı")
    
    # Also delete student's grades and attendance
    await db.student_grades.delete_many({"student_id": student_id})
    await db.student_attendance.delete_many({"student_id": student_id})
    
    return {"message": "Öğrenci silindi"}

# Student Grades endpoints
@api_router.get("/students/{student_id}/grades", response_model=List[StudentGrade])
async def get_student_grades(student_id: str):
    grades = await db.student_grades.find({"student_id": student_id}, {"_id": 0}).to_list(length=None)
    return [StudentGrade(**g) for g in grades]

@api_router.post("/students/grades", response_model=StudentGrade)
async def create_student_grade(grade_data: StudentGradeCreate, current_user: User = Depends(get_current_admin)):
    new_grade = StudentGrade(**grade_data.model_dump())
    await db.student_grades.insert_one(new_grade.model_dump())
    
    # Recalculate GPA
    await recalculate_student_gpa(grade_data.student_id)
    
    return new_grade

@api_router.put("/students/grades/{grade_id}", response_model=StudentGrade)
async def update_student_grade(grade_id: str, grade_data: StudentGradeUpdate, current_user: User = Depends(get_current_admin)):
    grade = await db.student_grades.find_one({"id": grade_id}, {"_id": 0})
    if not grade:
        raise HTTPException(status_code=404, detail="Not bulunamadı")
    
    update_data = {k: v for k, v in grade_data.model_dump().items() if v is not None}
    if update_data:
        await db.student_grades.update_one({"id": grade_id}, {"$set": update_data})
    
    updated = await db.student_grades.find_one({"id": grade_id}, {"_id": 0})
    
    # Recalculate GPA
    await recalculate_student_gpa(grade['student_id'])
    
    return StudentGrade(**updated)

@api_router.delete("/students/grades/{grade_id}")
async def delete_student_grade(grade_id: str, current_user: User = Depends(get_current_admin)):
    grade = await db.student_grades.find_one({"id": grade_id}, {"_id": 0})
    if not grade:
        raise HTTPException(status_code=404, detail="Not bulunamadı")
    
    result = await db.student_grades.delete_one({"id": grade_id})
    
    # Recalculate GPA
    await recalculate_student_gpa(grade['student_id'])
    
    return {"message": "Not silindi"}

# Student Attendance endpoints
@api_router.get("/students/{student_id}/attendance", response_model=List[StudentAttendance])
async def get_student_attendance(student_id: str):
    attendance = await db.student_attendance.find({"student_id": student_id}, {"_id": 0}).to_list(length=None)
    return [StudentAttendance(**a) for a in attendance]

@api_router.post("/students/attendance", response_model=StudentAttendance)
async def create_student_attendance(attendance_data: StudentAttendanceCreate, current_user: User = Depends(get_current_admin)):
    absence_percentage = ((attendance_data.total_hours - attendance_data.attended_hours) / attendance_data.total_hours) * 100
    
    new_attendance = StudentAttendance(
        **attendance_data.model_dump(),
        absence_percentage=round(absence_percentage, 2)
    )
    await db.student_attendance.insert_one(new_attendance.model_dump())
    return new_attendance

@api_router.put("/students/attendance/{attendance_id}", response_model=StudentAttendance)
async def update_student_attendance(attendance_id: str, attendance_data: StudentAttendanceUpdate, current_user: User = Depends(get_current_admin)):
    attendance = await db.student_attendance.find_one({"id": attendance_id}, {"_id": 0})
    if not attendance:
        raise HTTPException(status_code=404, detail="Devamsızlık kaydı bulunamadı")
    
    update_data = {k: v for k, v in attendance_data.model_dump().items() if v is not None}
    if update_data:
        # Recalculate absence percentage
        updated_attendance = {**attendance, **update_data}
        absence_percentage = ((updated_attendance['total_hours'] - updated_attendance['attended_hours']) / updated_attendance['total_hours']) * 100
        update_data['absence_percentage'] = round(absence_percentage, 2)
        
        await db.student_attendance.update_one({"id": attendance_id}, {"$set": update_data})
    
    updated = await db.student_attendance.find_one({"id": attendance_id}, {"_id": 0})
    return StudentAttendance(**updated)

@api_router.delete("/students/attendance/{attendance_id}")
async def delete_student_attendance(attendance_id: str, current_user: User = Depends(get_current_admin)):
    result = await db.student_attendance.delete_one({"id": attendance_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Devamsızlık kaydı bulunamadı")
    return {"message": "Devamsızlık kaydı silindi"}

# Helper function for GPA calculation
async def recalculate_student_gpa(student_id: str):
    grades = await db.student_grades.find({"student_id": student_id}, {"_id": 0}).to_list(length=None)
    
    grade_points = {
        "AA": 4.0, "BA": 3.5, "BB": 3.0, "CB": 2.5, "CC": 2.0,
        "DC": 1.5, "DD": 1.0, "FD": 0.5, "FF": 0.0
    }
    
    total_points = 0
    total_credits = 0
    
    for grade in grades:
        if grade.get('grade') and grade['grade'] in grade_points:
            total_points += grade_points[grade['grade']] * grade['credit']
            total_credits += grade['credit']
    
    gpa = round(total_points / total_credits, 2) if total_credits > 0 else 0.0
    
    await db.students.update_one({"id": student_id}, {"$set": {"gpa": gpa}})

# Weather endpoint
@api_router.get("/weather")
async def get_weather(lat: float, lon: float):
    """
    Get weather data for given coordinates using Open-Meteo API (no API key required)
    """
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://api.open-meteo.com/v1/forecast",
                params={
                    "latitude": lat,
                    "longitude": lon,
                    "current": "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code",
                    "timezone": "auto"
                },
                timeout=10.0
            )
            response.raise_for_status()
            data = response.json()
            
            current = data["current"]
            
            # Map weather codes to descriptions (Turkish)
            weather_descriptions = {
                0: "Açık", 1: "Çoğunlukla açık", 2: "Parçalı bulutlu", 3: "Bulutlu",
                45: "Sisli", 48: "Dondurucu sis",
                51: "Hafif çiseleyen", 53: "Çiseleyen", 55: "Yoğun çiseleyen",
                61: "Hafif yağmurlu", 63: "Yağmurlu", 65: "Şiddetli yağmurlu",
                71: "Hafif karlı", 73: "Karlı", 75: "Şiddetli karlı",
                77: "Dolu", 80: "Sağanak yağışlı", 81: "Orta sağanak", 82: "Şiddetli sağanak",
                85: "Kar yağışlı", 86: "Şiddetli kar yağışlı",
                95: "Fırtınalı", 96: "Fırtına ve dolu", 99: "Şiddetli fırtına"
            }
            
            # Map weather codes to icons (simplified)
            weather_icons = {
                0: "01d", 1: "02d", 2: "03d", 3: "04d",
                45: "50d", 48: "50d",
                51: "09d", 53: "09d", 55: "09d",
                61: "10d", 63: "10d", 65: "10d",
                71: "13d", 73: "13d", 75: "13d",
                77: "13d", 80: "09d", 81: "09d", 82: "09d",
                85: "13d", 86: "13d",
                95: "11d", 96: "11d", 99: "11d"
            }
            
            weather_code = current.get("weather_code", 0)
            
            # Get city name using reverse geocoding
            city = "Konum"
            try:
                geo_response = await client.get(
                    f"https://geocode.maps.co/reverse",
                    params={"lat": lat, "lon": lon},
                    timeout=5.0
                )
                if geo_response.status_code == 200:
                    geo_data = geo_response.json()
                    address = geo_data.get("address", {})
                    city = address.get("city") or address.get("town") or address.get("county") or address.get("state") or "Konum"
            except:
                pass
            
            return {
                "temp": round(current["temperature_2m"]),
                "feels_like": round(current["apparent_temperature"]),
                "humidity": current["relative_humidity_2m"],
                "description": weather_descriptions.get(weather_code, "Bilinmiyor"),
                "icon": weather_icons.get(weather_code, "01d"),
                "city": city,
                "country": ""
            }
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=502, detail=f"Weather API error: {str(e)}")
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="Weather API timeout")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching weather: {str(e)}")

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()