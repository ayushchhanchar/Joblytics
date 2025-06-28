
const LandingPage = () => {
    return (
        <div className="flex justify-center items-center h-screen flex-col gap-4">
            <h1 className="text-3xl font-bold underline">
                Landing Page
            </h1>
            <div className="flex gap-4">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => window.location.href = "/login"}>Login</button>
                <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={()=>window.location.href="/register"}>Register</button>
            </div>
        </div>
    );
}
export default LandingPage