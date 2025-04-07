import axios from 'axios';

const getAccessToken = (): string | null => {
    const token = localStorage.getItem("token"); // Đảm bảo đúng key
    if (!token) {
        alert("❌ Bạn chưa đăng nhập! Vui lòng đăng nhập lại.");
        return null;
    }
    return token;
};

export const getTotalquestion = async () => {
    const res = await fetch("https://app-toiec-be-v4.onrender.com/api/questions/countallquestion");
    const json = await res.json();
    return json.data; // Trả về mảng [{date, count}]
};

export const fetchAllQuestions = async () => {
    try {
        const res = await fetch("https://app-toiec-be-v4.onrender.com/api/questions");
        if (!res.ok) {
            throw new Error("Lỗi khi gọi API lấy câu hỏi");
        }

        const json = await res.json();
        return json.data; // ✅ Mảng câu hỏi
    } catch (error) {
        console.error("❌ Lỗi fetchAllQuestions:", error);
        return [];
    }
};
export const fetchQuestionsWithPagination = async (page = 1, limit = 10) => {
    const res = await fetch(`https://app-toiec-be-v4.onrender.com/api/questions/paginate?page=${page}&limit=${limit}`);
    const json = await res.json();

    return {
        questions: json.data.questions,
        total: json.data.total,
    };
};
// 🟢 Gửi yêu cầu tạo câu hỏi mới
export const createQuestion = async (questionData: any) => {
    const token = getAccessToken();
    if (!token) throw new Error("Không có accessToken!");

    const res = await fetch("https://app-toiec-be-v4.onrender.com/api/questions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // ✅ dùng đúng token đã get
        },
        body: JSON.stringify(questionData),
    });

    const result = await res.json();

    if (!res.ok) {
        console.error("❌ API lỗi:", res.status, result);
        throw new Error(result?.message || "Tạo câu hỏi thất bại");
    }

    return result;
};

export const importQuestionsFromCSV = async (file: File) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Bạn chưa đăng nhập!");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("https://app-toiec-be-v4.onrender.com/api/questions/import-csv", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`, // KHÔNG set Content-Type ở đây!
        },
        body: formData,
    });

    const result = await res.json();

    if (!res.ok) {
        console.error("❌ Import CSV lỗi:", result);
        throw new Error(result.message || "Import CSV thất bại");
    }

    return result.data; // nếu BE trả về danh sách câu hỏi
};

export const deleteQuestion = async (id: number) => {
    const token = getAccessToken();
    if (!token) throw new Error("Bạn chưa đăng nhập!");

    const response = await fetch(`https://app-toiec-be-v4.onrender.com/api/questions/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        }
    });

    if (!response.ok) {
        throw new Error("❌ Xoá câu hỏi thất bại!");
    }

    return await response.json(); // hoặc response.status nếu BE không trả body
};

export const updateQuestion = async (id: number, data: any) => {
    const token = getAccessToken();
    if (!token) throw new Error("Bạn chưa đăng nhập!");

    const response = await fetch(`https://app-toiec-be-v4.onrender.com/api/questions/${id}`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || "❌ Cập nhật câu hỏi thất bại!");
    }

    return await response.json();
};
