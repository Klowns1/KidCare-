'use client';

function newId() {
    return crypto.randomUUID();
}

function nowIso() {
    return new Date().toISOString();
}

function readList<T>(key: string): T[] {
    if (typeof window === 'undefined') return [];
    try {
        return JSON.parse(localStorage.getItem(key) || '[]') as T[];
    } catch {
        return [];
    }
}

function writeList<T>(key: string, items: T[]) {
    localStorage.setItem(key, JSON.stringify(items));
}

function listWhere<T>(
    key: string,
    match: (item: T) => boolean,
    compare: (a: T, b: T) => number
): T[] {
    return readList<T>(key).filter(match).sort(compare);
}

export type ParentProfile = {
    id: string;
    user_id: string;
    gender: string | null;
    age: number | null;
    education_level: string | null;
    occupation: string | null;
    family_income: string | null;
    marital_status: string | null;
    family_type: string | null;
    relationship_to_child: string | null;
    updated_at: string;
    created_at: string;
};

export type ChildRecord = {
    id: string;
    parent_id: string;
    gender: string | null;
    birth_date: string | null;
    birth_order: number | null;
    weight: number | null;
    height: number | null;
    decayed_teeth: number | null;
    dentist_visit_history: string | null;
    dspm_gross_motor: string | null;
    dspm_fine_motor: string | null;
    dspm_language_comprehension: string | null;
    dspm_language_use: string | null;
    dspm_self_help: string | null;
    updated_at: string;
    created_at: string;
};

export type AssessmentResult = {
    id: string;
    user_id: string;
    test_type: string;
    total_score: number;
    literacy_level: string;
    recommendations: string;
    score_access_info?: number;
    score_knowledge?: number;
    score_communication?: number;
    score_media_literacy?: number;
    score_decision_making?: number;
    score_care_management?: number;
    created_at: string;
};

export type BehaviorLog = {
    id: string;
    child_id: string;
    log_date: string;
    meals_3_per_day: boolean;
    fruits_vegetables: boolean;
    breakfast: boolean;
    processed_food: boolean;
    brushed_teeth: boolean;
    dental_checkup: boolean;
    bottle_before_bed: boolean;
    read_stories: boolean;
    played_with_child: boolean;
    self_help_training: boolean;
    praised_child: boolean;
    notes: string | null;
};

export type HealthRecord = {
    id: string;
    child_id: string;
    record_date: string;
    weight: string | number;
    height: string | number;
};

export type NotificationItem = {
    id: string;
    user_id: string;
    type: string;
    title: string;
    message: string;
    is_read: boolean;
    created_at: string;
};

export type Appointment = {
    id: string;
    user_id: string;
    appointment_date: string;
    appointment_time: string;
    reason: string;
    status: string;
    created_at: string;
};

export type ChatMessage = {
    id: string;
    user_id: string;
    sender_type: string;
    message: string;
    created_at: string;
};

export type StoredFile = {
    id: string;
    user_id: string;
    name: string;
    size: number;
    type: string;
    data_url: string;
    created_at: string;
};

const KEYS = {
    parents: 'kidcare_parent_profiles',
    children: 'kidcare_children',
    assessments: 'kidcare_assessment_results',
    behavior: 'kidcare_behavior_logs',
    health: 'kidcare_health_records',
    notifications: 'kidcare_notifications',
    appointments: 'kidcare_appointments',
    chat: 'kidcare_chat_messages',
    files: 'kidcare_files',
} as const;

const byCreatedDesc = <T extends { created_at: string }>(a: T, b: T) =>
    b.created_at.localeCompare(a.created_at);

export function getParentByUserId(userId: string): ParentProfile | null {
    return readList<ParentProfile>(KEYS.parents).find((p) => p.user_id === userId) ?? null;
}

export function upsertParentProfile(
    userId: string,
    data: Partial<Omit<ParentProfile, 'id' | 'user_id' | 'created_at'>>
): ParentProfile {
    const list = readList<ParentProfile>(KEYS.parents);
    const existing = list.find((p) => p.user_id === userId);
    const stamp = nowIso();

    if (existing) {
        Object.assign(existing, data, { updated_at: stamp });
        writeList(KEYS.parents, list);
        return existing;
    }

    const created: ParentProfile = {
        id: newId(),
        user_id: userId,
        gender: null,
        age: null,
        education_level: null,
        occupation: null,
        family_income: null,
        marital_status: null,
        family_type: null,
        relationship_to_child: null,
        ...data,
        updated_at: stamp,
        created_at: stamp,
    };
    list.push(created);
    writeList(KEYS.parents, list);
    return created;
}

export function ensureParentProfile(userId: string): ParentProfile {
    return getParentByUserId(userId) ?? upsertParentProfile(userId, {});
}

export function listChildren(parentId: string): ChildRecord[] {
    return listWhere(KEYS.children, (c: ChildRecord) => c.parent_id === parentId, byCreatedDesc);
}

export function getChild(childId: string): ChildRecord | null {
    return readList<ChildRecord>(KEYS.children).find((c) => c.id === childId) ?? null;
}

export function insertChild(
    parentId: string,
    data: Omit<ChildRecord, 'id' | 'parent_id' | 'created_at' | 'updated_at'>
): ChildRecord {
    const list = readList<ChildRecord>(KEYS.children);
    const stamp = nowIso();
    const created: ChildRecord = {
        id: newId(),
        parent_id: parentId,
        ...data,
        created_at: stamp,
        updated_at: stamp,
    };
    list.unshift(created);
    writeList(KEYS.children, list);
    return created;
}

export function updateChild(
    childId: string,
    data: Partial<Omit<ChildRecord, 'id' | 'parent_id' | 'created_at'>>
): ChildRecord {
    const list = readList<ChildRecord>(KEYS.children);
    const idx = list.findIndex((c) => c.id === childId);
    if (idx < 0) throw new Error('ไม่พบข้อมูลเด็ก');
    list[idx] = { ...list[idx], ...data, updated_at: nowIso() };
    writeList(KEYS.children, list);
    return list[idx];
}

export function getLatestAssessment(userId: string, testType: string): AssessmentResult | null {
    return (
        listWhere(
            KEYS.assessments,
            (a: AssessmentResult) => a.user_id === userId && a.test_type === testType,
            byCreatedDesc
        )[0] ?? null
    );
}

export function insertAssessment(
    payload: Omit<AssessmentResult, 'id' | 'created_at'>
): AssessmentResult {
    const list = readList<AssessmentResult>(KEYS.assessments);
    const created: AssessmentResult = { ...payload, id: newId(), created_at: nowIso() };
    list.unshift(created);
    writeList(KEYS.assessments, list);
    return created;
}

export function listBehaviorLogs(childId: string): BehaviorLog[] {
    return listWhere(
        KEYS.behavior,
        (l: BehaviorLog) => l.child_id === childId,
        (a, b) => b.log_date.localeCompare(a.log_date)
    );
}

export function upsertBehaviorLog(payload: Omit<BehaviorLog, 'id'>): BehaviorLog {
    const list = readList<BehaviorLog>(KEYS.behavior);
    const existing = list.find(
        (l) => l.child_id === payload.child_id && l.log_date === payload.log_date
    );
    if (existing) {
        Object.assign(existing, payload);
        writeList(KEYS.behavior, list);
        return existing;
    }
    const created: BehaviorLog = { ...payload, id: newId() };
    list.unshift(created);
    writeList(KEYS.behavior, list);
    return created;
}

export function listHealthRecords(childId: string): HealthRecord[] {
    return listWhere(
        KEYS.health,
        (r: HealthRecord) => r.child_id === childId,
        (a, b) => a.record_date.localeCompare(b.record_date)
    );
}

export function listNotifications(userId: string): NotificationItem[] {
    return listWhere(
        KEYS.notifications,
        (n: NotificationItem) => n.user_id === userId,
        byCreatedDesc
    );
}

export function markNotificationRead(id: string) {
    const list = readList<NotificationItem>(KEYS.notifications);
    const item = list.find((n) => n.id === id);
    if (!item) return;
    item.is_read = true;
    writeList(KEYS.notifications, list);
}

export function markAllNotificationsRead(userId: string) {
    const list = readList<NotificationItem>(KEYS.notifications);
    for (const n of list) {
        if (n.user_id === userId) n.is_read = true;
    }
    writeList(KEYS.notifications, list);
}

export function seedWelcomeNotification(userId: string) {
    const list = readList<NotificationItem>(KEYS.notifications);
    if (list.some((n) => n.user_id === userId && n.type === 'system')) return;
    list.unshift({
        id: newId(),
        user_id: userId,
        type: 'system',
        title: 'ยินดีต้อนรับสู่ KidCare',
        message: 'บัญชีพร้อมใช้งานแล้ว สามารถกรอกโปรไฟล์ลูกและเริ่มบันทึกได้เลยค่ะ',
        is_read: false,
        created_at: nowIso(),
    });
    writeList(KEYS.notifications, list);
}

export function listAppointments(userId: string): Appointment[] {
    return listWhere(
        KEYS.appointments,
        (a: Appointment) => a.user_id === userId,
        (a, b) => {
            const dateA = `${a.appointment_date}T${a.appointment_time}`;
            const dateB = `${b.appointment_date}T${b.appointment_time}`;
            return dateA.localeCompare(dateB);
        }
    );
}

export function insertAppointment(
    payload: Omit<Appointment, 'id' | 'created_at' | 'status'> & { status?: string }
): Appointment {
    const list = readList<Appointment>(KEYS.appointments);
    const created: Appointment = {
        id: newId(),
        user_id: payload.user_id,
        appointment_date: payload.appointment_date,
        appointment_time: payload.appointment_time,
        reason: payload.reason,
        status: payload.status || 'pending',
        created_at: nowIso(),
    };
    list.push(created);
    writeList(KEYS.appointments, list);
    return created;
}

export function updateAppointmentStatus(id: string, status: string): void {
    const list = readList<Appointment>(KEYS.appointments);
    const item = list.find((a) => a.id === id);
    if (!item) return;
    item.status = status;
    writeList(KEYS.appointments, list);
}

export function listChatMessages(userId: string): ChatMessage[] {
    return listWhere(
        KEYS.chat,
        (m: ChatMessage) => m.user_id === userId,
        (a, b) => a.created_at.localeCompare(b.created_at)
    );
}

export function insertChatMessage(
    payload: Omit<ChatMessage, 'id' | 'created_at'>
): ChatMessage {
    const list = readList<ChatMessage>(KEYS.chat);
    const created: ChatMessage = {
        ...payload,
        id: newId(),
        created_at: nowIso(),
    };
    list.push(created);
    writeList(KEYS.chat, list);
    return created;
}

export function listFiles(userId: string): StoredFile[] {
    return listWhere(
        KEYS.files,
        (f: StoredFile) => f.user_id === userId,
        byCreatedDesc
    );
}

export function insertFile(payload: Omit<StoredFile, 'id' | 'created_at'>): StoredFile {
    const list = readList<StoredFile>(KEYS.files);
    const created: StoredFile = { ...payload, id: newId(), created_at: nowIso() };
    list.unshift(created);
    writeList(KEYS.files, list);
    return created;
}

export function deleteFile(userId: string, fileId: string): void {
    const list = readList<StoredFile>(KEYS.files).filter(
        (f) => !(f.user_id === userId && (f.id === fileId || f.name === fileId))
    );
    writeList(KEYS.files, list);
}

export function getFile(userId: string, fileIdOrName: string): StoredFile | null {
    return (
        readList<StoredFile>(KEYS.files).find(
            (f) => f.user_id === userId && (f.id === fileIdOrName || f.name === fileIdOrName)
        ) ?? null
    );
}
