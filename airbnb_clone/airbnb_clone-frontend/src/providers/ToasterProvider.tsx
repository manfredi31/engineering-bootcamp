import { Toaster } from 'react-hot-toast'

const ToasterProvider = () => {
    return (
        <Toaster
            position="top-center"
            reverseOrder={false}
            toastOptions={{
                duration: 3000,
                style: {
                    background: '#333',
                    color: '#fff',
                },
            }}
        />
    );
}

export default ToasterProvider