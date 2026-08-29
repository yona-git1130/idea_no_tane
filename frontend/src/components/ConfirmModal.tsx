// 「はい/いいえ」で確認を取るための汎用モーダル。
// window.confirm()は使わず、この自作モーダルで確認を取る。
export function ConfirmModal({
  message,
  onConfirm,
  onCancel,
}: {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <p className="modal-message">{message}</p>
        <div className="modal-actions">
          <button type="button" className="btn" onClick={onCancel}>
            いいえ
          </button>
          <button type="button" className="btn btn-primary" onClick={onConfirm}>
            はい
          </button>
        </div>
      </div>
    </div>
  );
}
