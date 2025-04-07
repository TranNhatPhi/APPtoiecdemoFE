import { useState, useEffect } from "react";
import { Exam } from "../models/exam";
import { fetchExams } from "../services/examService";

const useExams = () => {
    const [exams, setExams] = useState<Exam[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getExams = async () => {
            try {
                console.log("Fetching exams from API...");
                const data = await fetchExams();
                console.log("Exams received:", data);
                setExams(data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to load exams:", error);
                setError("Failed to load exams");
                setLoading(false);
            }
        };
        getExams();
    }, []);

    return { exams, loading, error };
};

export default useExams;
