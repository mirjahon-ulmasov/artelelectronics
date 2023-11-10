import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

export function NotFound() {
    const navigate = useNavigate()
    return (
        <Result
            status="404"
            title="404"
            subTitle="К сожалению, страница, которую вы посетили, не существует."
            extra={(
                <Button type="primary" onClick={() => navigate(-1)}>
                    Назад
                </Button>
            )}
        />
    )
}
