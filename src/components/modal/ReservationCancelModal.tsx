"use client";

import Modal from "./Modal";

interface PolicyRow {
  label: string;
  penalty: string;
  refund: string;
}

interface ReservationCancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  createdAt: string;
  timeSlot: string;
  name: string;
  amountPaid: number;
  refundAmount: number;
  refundLabel: string;
  policy: PolicyRow[];
}

export default function ReservationCancelModal({
  isOpen,
  onClose,
  onConfirm,
  loading,
  createdAt,
  timeSlot,
  name,
  amountPaid,
  refundAmount,
  refundLabel,
  policy,
}: ReservationCancelModalProps) {
  const formatDateTime = (s: string) => {
    if (!s) return "-";
    const d = new Date(s);
    return d.toLocaleString("ko-KR", {
      year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", second: "2-digit",
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="예약 취소"
      footer={
        <>
          <button className="modal-btn modal-btn-secondary" onClick={onClose}>
            돌아가기
          </button>
          <button className="modal-btn modal-btn-danger" onClick={onConfirm} disabled={loading}>
            취소하기
          </button>
        </>
      }
    >
      {loading ? (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <div className="spinner" style={{ margin: "0 auto" }} />
        </div>
      ) : (
        <>
          <div className="cancel-info">
            <div className="confirm-row">
              <span className="confirm-label">예약일시</span>
              <span className="confirm-value">{formatDateTime(createdAt)}</span>
            </div>
            <div className="confirm-row">
              <span className="confirm-label">시간</span>
              <span className="confirm-value">{timeSlot}</span>
            </div>
            <div className="confirm-row">
              <span className="confirm-label">신청인</span>
              <span className="confirm-value">{name}</span>
            </div>
            <div className="confirm-row">
              <span className="confirm-label">결제금액</span>
              <span className="confirm-value">{amountPaid > 0 ? `${amountPaid.toLocaleString()}원` : "미결제"}</span>
            </div>
            <div className="confirm-row">
              <span className="confirm-label">환불금액</span>
              <span className="confirm-value cancel-refund">
                {amountPaid > 0 ? `${refundAmount.toLocaleString()}원 (${refundLabel})` : "-"}
              </span>
            </div>
          </div>

          <div className="cancel-policy">
            <h4 className="cancel-policy-title">취소 및 환불 기준</h4>
            <table className="cancel-policy-table">
              <thead>
                <tr>
                  <th>구분</th>
                  <th>위약금</th>
                  <th>환불액</th>
                </tr>
              </thead>
            </table>
            <div className="cancel-policy-table-wrapper">
              <table className="cancel-policy-table">
                <tbody>
                  {policy.map((row, i) => (
                    <tr key={i} className={row.label === refundLabel ? "cancel-policy-active" : ""}>
                      <td>{row.label}</td>
                      <td>{row.penalty}</td>
                      <td>{row.refund}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </Modal>
  );
}
