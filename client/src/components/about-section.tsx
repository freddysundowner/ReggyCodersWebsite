export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">About Reggycodas</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Founded by visionary entrepreneur Fredrick Mundia Githumbi, Reggycodas is at the forefront 
              of Kenya's technology revolution. We specialize in developing cutting-edge software products 
              and nurturing innovative startups that solve real-world problems.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Our mission is to empower businesses and communities through technology. From mobile applications 
              to enterprise management systems, we create solutions that drive growth, efficiency, and innovation 
              across various industries.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-4 bg-primary/5 dark:bg-primary/10 rounded-lg">
                <div className="text-3xl font-bold text-primary">5+</div>
                <div className="text-gray-600 dark:text-gray-300">Major Products</div>
              </div>
              <div className="text-center p-4 bg-accent/5 dark:bg-accent/10 rounded-lg">
                <div className="text-3xl font-bold text-accent">100+</div>
                <div className="text-gray-600 dark:text-gray-300">Happy Clients</div>
              </div>
            </div>
          </div>
          
          <div>
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400" 
              alt="Software development team collaboration" 
              className="rounded-xl shadow-lg w-full h-auto"
            />
          </div>
        </div>

        {/* Founder Section */}
        <div className="mt-20 bg-gray-50 dark:bg-gray-900 rounded-2xl p-8 lg:p-12">
          <div className="grid lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Meet Our Founder</h3>
              <h4 className="text-xl font-semibold text-primary mb-4">Fredrick Mundia Githumbi</h4>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                A passionate technologist and entrepreneur with a vision to transform Kenya's digital landscape. 
                Fredrick combines technical expertise with business acumen to create solutions that make a real impact.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Under his leadership, Reggycodas has grown from a startup idea to a leading technology company, 
                developing products that serve thousands of users across multiple industries.
              </p>
            </div>
            <div className="text-center">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=300" 
                alt="Fredrick Mundia Githumbi, Founder of Reggycodas" 
                className="w-48 h-48 rounded-full mx-auto shadow-lg object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
