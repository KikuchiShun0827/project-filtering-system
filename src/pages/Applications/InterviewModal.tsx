import { useState } from 'react'
import Modal from '../../components/Modal'
import type { Application } from '../../types'

/** 先方から面談の回答が来た応募に、面談日時を登録するモーダル */
const InterviewModal = ({
  application,
  onSubmit,
  onClose,
}: {
  application: Application
  /** 面談日時 YYYY-MM-DDTHH:mm */
  onSubmit: (interviewAt: string) => void
  onClose: () => void
}) => {
  const [interviewAt, setInterviewAt] = useState(application.interviewAt ?? '')
  const [error, setError] = useState('')

  return (
    <Modal title="面談予定を登録" onClose={onClose}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (!interviewAt) {
            setError('面談日時を入力してください。')
            return
          }
          onSubmit(interviewAt)
        }}
      >
        <div className="field">
          <label>応募</label>
          <div className="modal-readonly">
            <div style={{ fontWeight: 700 }}>{application.projectTitle}</div>
            <div className="muted small">
              {application.company} ／ {application.engineerName}
            </div>
          </div>
        </div>

        <div className="field">
          <label htmlFor="interview-at">面談日時</label>
          <input
            id="interview-at"
            type="datetime-local"
            value={interviewAt}
            onChange={(e) => {
              setInterviewAt(e.target.value)
              setError('')
            }}
          />
        </div>

        <div className="form-actions">
          {error && <span className="form-error">{error}</span>}
          <button type="button" className="btn" onClick={onClose}>
            キャンセル
          </button>
          <button type="submit" className="btn btn-primary">
            登録
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default InterviewModal
