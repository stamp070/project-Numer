const DropdownMenu = () => {
    return (
      <div className="dropdown dropdown-end my-10">
        <label tabIndex={0} className="btn m-1">
          Root of Equation
          <svg
            className="fill-current w-4 h-4 ml-2"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M7 10l5 5 5-5H7z" />
          </svg>
        </label>
        <ul
          tabIndex={0}
          className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
        >
          <li><a>Root of Equation</a></li>
          <li><a>Linear Algebra Equation</a></li>
          <li><a>Interpolation</a></li>
          <li><a>Extrapolation</a></li>
          <li><a>Integration</a></li>
          <li><a>Differentiation</a></li>
        </ul>
      </div>
    );
  };
  
  export default DropdownMenu;
  