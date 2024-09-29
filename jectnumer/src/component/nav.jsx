
const Navbar = () => {
    return (
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <a className="btn btn-ghost normal-case text-xl">daisyUI</a>
        </div>
  
        <div className="flex-none hidden lg:block">
          <ul className="menu menu-horizontal">
            <li><a href="#graphical">Graphical Methods</a></li>
            <li><a href="#false-position">False Position Method</a></li>
            <li><a href="#bisection">Bisection Search</a></li>
            <li><a href="#one-point">One-Point Iteration</a></li>
            <li><a href="#newton-raphson">Newton-Raphson Method</a></li>
            <li><a href="#secant">Secant Method</a></li>
          </ul>
        </div>
        
      </div>
    );
  };
  
  export default Navbar;
  