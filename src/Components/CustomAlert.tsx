export default function CustomAlert({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 flex items-center top-0 right-0 justify-center  bg-opacity-10 bg-black z-50">
      <div className="bg-bg-color text-black w-80 pt-3 rounded-lg shadow-xl  text-center px-2">
        <h2 className="text-md mb-2 mt-2">{message}</h2>
        <hr />
        <button
          onClick={onClose}
          className=" text-black w-4/5 py-1 mt-3 rounded-lg mb-5 text-sm bg-bg-button "
        >
          OK
        </button>
      </div>
    </div>
  );
}