import { Button, Result } from "antd";

export default function EditColor() {
    return (
        <Result
            status="404"
            title="В разработке"
            subTitle="К сожалению, страница, которую вы посетили, еще не существует."
            extra={<Button type="primary">Back Home</Button>}
        />
    )
}
