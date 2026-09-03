import { useNavigate } from 'react-router-dom'
import EngineerForm from '../../components/EngineerForm'
import { DetailHeader } from '../../components/Page'
import { useData } from '../../store/DataContext'

const EngineerNew = () => {
  const navigate = useNavigate()
  const { addEngineer } = useData()

  return (
    <>
      <DetailHeader
        title="要員を追加"
        description="登録するとマッチ率の計算対象になります（モックのためブラウザ内のみ保持）。"
      />
      <EngineerForm
        submitLabel="登録する"
        // 追加直後の詳細画面から戻ったときにフォームへ逆戻りしないよう replace
        onSubmit={(values) => navigate(`/engineers/${addEngineer(values)}`, { replace: true })}
      />
    </>
  )
}

export default EngineerNew
