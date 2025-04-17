interface Props {
  dotVisible?: boolean;
}

const CartIcon = ({ dotVisible = false }: Props) => {
  return (
    <div className="h-8 w-8 hover:scale-110 duration-300 cursor-pointer relative">
      <svg
        className="h-8 w-8"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        style={{ transform: "scaleX(-1)" }}
        fill="currentColor"
      >
        <g id="shopping_cart" data-name="shopping cart">
          <path d="M29.74 8.32A1 1 0 0 0 29 8H13a1 1 0 0 0 0 2h14.91l-.81 9.48a1.87 1.87 0 0 1-2 1.52H12.88a1.87 1.87 0 0 1-2-1.52L10 8.92v-.16L9.33 6.2A3.89 3.89 0 0 0 7 3.52L3.37 2.07a1 1 0 0 0-.74 1.86l3.62 1.45a1.89 1.89 0 0 1 1.14 1.3L8 9.16l.9 10.49a3.87 3.87 0 0 0 4 3.35h.1v2.18a3 3 0 1 0 2 0V23h8v2.18a3 3 0 1 0 2 0V23h.12a3.87 3.87 0 0 0 4-3.35L30 9.08a1 1 0 0 0-.26-.76zM14 29a1 1 0 1 1 1-1 1 1 0 0 1-1 1zm10 0a1 1 0 1 1 1-1 1 1 0 0 1-1 1z" />
          <path d="M15 18v-5a1 1 0 0 0-2 0v5a1 1 0 0 0 2 0zM20 18v-5a1 1 0 0 0-2 0v5a1 1 0 0 0 2 0zM25 18v-5a1 1 0 0 0-2 0v5a1 1 0 0 0 2 0z" />
        </g>
      </svg>
      {dotVisible && (
        <div className="absolute -top-1 -left-1 bg-red-500 rounded-full w-3 h-3 text-white text-xs flex items-center justify-center font-bold"></div>
      )}
    </div>
  );
};

export default CartIcon;
