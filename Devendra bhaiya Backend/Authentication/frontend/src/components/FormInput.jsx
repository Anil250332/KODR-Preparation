const FormInput = ({ label, id, type = "text", error, register, ...props }) => {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-zinc-300">
        {label}
      </label>
      <input
        id={id}
        type={type}
        aria-invalid={error ? "true" : "false"}
        className={`w-full rounded-lg border bg-zinc-900 px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none transition focus:ring-2 ${
          error
            ? "border-red-500/70 focus:ring-red-500/30"
            : "border-zinc-800 focus:border-indigo-500 focus:ring-indigo-500/30"
        }`}
        {...register}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error.message}</p>}
    </div>
  );
};

export default FormInput;
