import { PageHeader, Section } from '../../components/Page'
import { useSettings } from '../../store/SettingsContext'
import AccountSection from './AccountSection'
import ClassifierSection from './ClassifierSection'
import DisplaySection from './DisplaySection'

const SettingsPage = () => {
  const { reset } = useSettings()

  return (
    <>
      <PageHeader
        title="設定"
        actions={
          <button className="btn btn-sm" onClick={reset}>
            初期状態に戻す
          </button>
        }
      />

      <div className="stack" style={{ maxWidth: 860 }}>
        <Section label="連携するメールアカウント">
          <AccountSection />
        </Section>

        <Section label="表示">
          <DisplaySection />
        </Section>

        <Section label="メール分類">
          <ClassifierSection />
        </Section>
      </div>
    </>
  )
}

export default SettingsPage
