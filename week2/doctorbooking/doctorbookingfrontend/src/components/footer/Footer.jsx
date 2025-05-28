import './Footer.css';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-gray-50 py-16 px-5">
            <div className="max-w-7xl mx-auto grid grid-cols-4 gap-16 mb-10">
                <div className="col-span-2">
                    <div className="mb-5">
                        <span className="text-2xl font-bold text-indigo-500">📋 Prescripto</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed max-w-md">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                    </p>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-5">COMPANY</h3>
                    <ul className="space-y-3">
                        <li className="text-gray-600 hover:text-indigo-500 transition-colors cursor-pointer">Home</li>
                        <li className="text-gray-600 hover:text-indigo-500 transition-colors cursor-pointer">About us</li>
                        <li className="text-gray-600 hover:text-indigo-500 transition-colors cursor-pointer">Delivery</li>
                        <li className="text-gray-600 hover:text-indigo-500 transition-colors cursor-pointer">Privacy policy</li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-5">GET IN TOUCH</h3>
                    <p className="text-sm text-gray-600 mb-2">+0-000-000-000</p>
                    <p className="text-sm text-gray-600">ciao.bro3108@gmail.com</p>
                </div>
            </div>
            <div className="border-t border-gray-200 pt-5 text-center">
                <p className="text-sm text-gray-600">Copyright 2025 © Manfredi.dev - All Right Reserved.</p>
            </div>
        </footer>
    );
}
