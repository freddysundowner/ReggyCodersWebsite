import { SiPython, SiNodedotjs, SiReact, SiMongodb, SiPostgresql, SiFlutter, SiAndroid, SiSwift, SiTensorflow } from "react-icons/si";

const technologies = [
  { name: "Python", icon: SiPython, color: "#3776AB" },
  { name: "Node.js", icon: SiNodedotjs, color: "#339933" },
  { name: "React.js", icon: SiReact, color: "#61DAFB" },
  { name: "MongoDB", icon: SiMongodb, color: "#47A248" },
  { name: "PostgreSQL", icon: SiPostgresql, color: "#4169E1" },
  { name: "Flutter", icon: SiFlutter, color: "#02569B" },
  { name: "Android", icon: SiAndroid, color: "#3DDC84" },
  { name: "SwiftUI", icon: SiSwift, color: "#F05138" },
  { name: "Machine Learning", icon: SiTensorflow, color: "#FF6F00" },
];

export default function TechnologiesSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Tech Stack
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We build with modern, battle-tested technologies to deliver reliable and scalable solutions.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-6">
          {technologies.map((tech) => {
            const Icon = tech.icon;
            return (
              <div
                key={tech.name}
                data-testid={`tech-card-${tech.name.toLowerCase().replace(/\./g, "")}`}
                className="flex flex-col items-center gap-3 p-5 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-200"
              >
                <Icon style={{ color: tech.color }} className="w-10 h-10" size={40} />
                <span className="text-sm font-medium text-gray-700 text-center">{tech.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
