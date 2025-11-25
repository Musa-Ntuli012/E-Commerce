export default function Footer() {
  return (
    <footer className="bg-neutral-text-primary text-white mt-auto">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <h3 className="text-2xl font-extrabold mb-4 gradient-text">SA Shop</h3>
            <p className="text-neutral-text-muted leading-relaxed">
              Your trusted South African e-commerce platform. Quality products, fast delivery, exceptional service.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-lg">Shop</h4>
            <ul className="space-y-3 text-neutral-text-muted">
              <li><a href="/shop" className="hover:text-primary transition-colors duration-200">All Products</a></li>
              <li><a href="/shop?category=Electronics" className="hover:text-primary transition-colors duration-200">Electronics</a></li>
              <li><a href="/shop?category=Fashion" className="hover:text-primary transition-colors duration-200">Fashion</a></li>
              <li><a href="/shop?category=Home%20%26%20Living" className="hover:text-primary transition-colors duration-200">Home & Living</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-lg">Customer Service</h4>
            <ul className="space-y-3 text-neutral-text-muted">
              <li><a href="#" className="hover:text-primary transition-colors duration-200">Contact Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors duration-200">Shipping Info</a></li>
              <li><a href="#" className="hover:text-primary transition-colors duration-200">Returns</a></li>
              <li><a href="#" className="hover:text-primary transition-colors duration-200">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-lg">Connect</h4>
            <ul className="space-y-3 text-neutral-text-muted">
              <li><a href="#" className="hover:text-primary transition-colors duration-200">Facebook</a></li>
              <li><a href="#" className="hover:text-primary transition-colors duration-200">Twitter</a></li>
              <li><a href="#" className="hover:text-primary transition-colors duration-200">Instagram</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-neutral-text-secondary/20 mt-12 pt-8 text-center text-neutral-text-muted">
          <p>&copy; 2024 SA Shop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

