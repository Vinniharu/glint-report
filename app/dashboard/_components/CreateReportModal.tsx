import { Modal } from "@/components/ui/Modal";
import { ReportForm } from "./ReportForm";

interface CreateReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: FormData) => Promise<void>;
}

export function CreateReportModal({
    isOpen,
    onClose,
    onSubmit,
}: CreateReportModalProps) {
    const handleSubmit = async (data: FormData) => {
        await onSubmit(data);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="COMPILE NEW REPORT"
            description="Enter report details and attach necessary data."
            className="max-w-2xl bg-black border border-gray-800 text-white"
        >
            <ReportForm onSubmit={handleSubmit} onCancel={onClose} />
        </Modal>
    );
}
