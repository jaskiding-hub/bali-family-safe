import { useForm } from '@inertiajs/react';

export default function DriverLogin() {
    const { data, setData, post, processing, errors } = useForm({ email: '', password: '', remember: false });

    function submit(e) {
        e.preventDefault();
        post('/driver/login');
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <form onSubmit={submit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
                <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Driver Login</h1>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        value={data.email}
                        onChange={e => setData('email', e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="driver@bfs.test"
                        required
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                        type="password"
                        value={data.password}
                        onChange={e => setData('password', e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="••••••••"
                        required
                    />
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>
                <div className="flex items-center mb-4">
                    <input
                        id="remember"
                        type="checkbox"
                        checked={data.remember}
                        onChange={e => setData('remember', e.target.checked)}
                        className="h-4 w-4 text-emerald-600 rounded border-gray-300"
                    />
                    <label htmlFor="remember" className="ml-2 text-sm text-gray-600 cursor-pointer">Remember me</label>
                </div>
                <button
                    type="submit"
                    disabled={processing}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-md p-2 transition disabled:opacity-50"
                >
                    {processing ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
}
