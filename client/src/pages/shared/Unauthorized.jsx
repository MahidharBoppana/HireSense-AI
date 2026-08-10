function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white">403</h1>

        <p className="mt-2 text-slate-400">
          You are not authorized to access this page.
        </p>
      </div>
    </div>
  );
}

export default Unauthorized;
