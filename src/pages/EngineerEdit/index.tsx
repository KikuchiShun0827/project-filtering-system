import { Link, useNavigate, useParams } from 'react-router-dom'
import EngineerForm from '../../components/EngineerForm'
import { DetailHeader, EmptyState } from '../../components/Page'
import { useData } from '../../store/DataContext'

const EngineerEdit = () => {
  const navigate = useNavigate()
  const { engineerId } = useParams()
  const { engineers, updateEngineer } = useData()

  const engineer = engineers.find((e) => e.id === engineerId)

  if (!engineer) {
    return (
      <EmptyState>
        要員が見つかりません。<Link to="/engineers">要員管理へ戻る</Link>
      </EmptyState>
    )
  }

  return (
    <>
      <DetailHeader
        title="要員を編集"
        description={`${engineer.name} の登録内容を編集します（モックのためブラウザ内のみ保持）。`}
      />
      <EngineerForm
        initial={engineer}
        submitLabel="保存する"
        onSubmit={(values) => {
          updateEngineer(engineer.id, values)
          navigate(`/engineers/${engineer.id}`, { replace: true })
        }}
      />
    </>
  )
}

export default EngineerEdit
