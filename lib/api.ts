export type UserRole = "admin" | "general_manager" | "deputy_general_manager" | "developer";

export interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    username: string;
    role: UserRole;
    created_at: string;
}

export interface CreateUserPayload {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    username: string;
    password: string;
    role: UserRole;
}

export interface UpdateUserRolePayload {
    role: UserRole;
}

export interface LoginPayload {
    identifier: string;
    password: string;
}

export interface RegisterPayload {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    password: string;
    username?: string;
}

export interface AuthResponse {
    token: string;
    user: Record<string, unknown>;
}

export interface ReportAttachment {
    type: "image" | "document" | "video" | "link" | "attachment";
    name: string;
    url: string;
}

export interface ReportContentBlock {
    type: "text" | "list" | "custom";
    label?: string;
    key?: string;
    value?: any;
    items?: any[];
}

export interface CreateReportPayload {
    title: string;
    body?: string;
    content?: ReportContentBlock[];
    attachments?: ReportAttachment[];
}

export interface Report {
    id: string;
    title: string;
    body: string;
    created_at: string;
    content?: ReportContentBlock[];
    attachments?: ReportAttachment[];
    developer_id: string;
    status: string;
    submitted_at: string;
    updated_at: string;
}

export interface ApiError {
    error: string;
}

const BASE_URL = "http://82.29.169.187:8093/api/v1";

async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const errorData = (await response.json().catch(() => ({}))) as ApiError;
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
    }
    // Handle 201 Created which might not return content or return the created resource
    if (response.status === 204) {
        return {} as T;
    }
    return response.json();
}

export const api = {
    users: {
        list: async (): Promise<User[]> => {
            const token = sessionStorage.getItem("token");
            const response = await fetch(`${BASE_URL}/admin/users`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return handleResponse<User[]>(response);
        },
        create: async (data: CreateUserPayload): Promise<User> => {
            const token = sessionStorage.getItem("token");
            const response = await fetch(`${BASE_URL}/admin/users`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });
            return handleResponse<User>(response);
        },
        updateRole: async (userId: string, data: UpdateUserRolePayload): Promise<void> => {
            const token = sessionStorage.getItem("token");
            const response = await fetch(`${BASE_URL}/admin/users/${userId}/role`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });
            return handleResponse<void>(response);
        },
    },
    auth: {
        login: async (data: LoginPayload): Promise<AuthResponse> => {
            const response = await fetch(`${BASE_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            return handleResponse<AuthResponse>(response);
        },
        me: async (token: string): Promise<Record<string, unknown>> => {
            const response = await fetch(`${BASE_URL}/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return handleResponse<Record<string, unknown>>(response);
        },
        register: async (data: RegisterPayload): Promise<void> => {
            const response = await fetch(`${BASE_URL}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            return handleResponse<void>(response);
        },
    },
    reports: {
        list: async (): Promise<Report[]> => {
            const token = sessionStorage.getItem("token");
            const response = await fetch(`${BASE_URL}/reports`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return handleResponse<Report[]>(response);
        },
        create: async (data: FormData): Promise<Report> => {
            const token = sessionStorage.getItem("token");
            const response = await fetch(`${BASE_URL}/reports`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    // Don't set Content-Type - browser will set it with boundary for FormData
                },
                body: data,
            });
            return handleResponse<Report>(response);
        },
    },
};
