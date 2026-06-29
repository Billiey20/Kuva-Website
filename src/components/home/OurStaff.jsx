import React from 'react';
import { Mail, Phone } from 'lucide-react';

const staffMembers = [
  {
    name: "Dr. Sarah Jenkins",
    role: "Head of OB/GYN",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300",
    bio: "Over 15 years of experience in maternal and fetal medicine."
  },
  {
    name: "Dr. Michael Chen",
    role: "Chief Cardiologist",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300",
    bio: "Specializes in interventional cardiology and heart failure management."
  },
  {
    name: "Dr. Emily Otieno",
    role: "Lead Pediatrician",
    image: "https://images.unsplash.com/photo-1594824432258-f6a133acdf07?auto=format&fit=crop&q=80&w=300&h=300",
    bio: "Dedicated to providing compassionate care for infants, children, and adolescents."
  },
  {
    name: "Dr. David Kamau",
    role: "Orthopedic Surgeon",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300&h=300",
    bio: "Expert in joint replacement and sports injury reconstruction."
  }
];

export default function OurStaff() {
  return (
    <section id="staff" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Meet Our Staff</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {staffMembers.map((staff, idx) => (
            <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-slate-100 group">
              <div className="aspect-square overflow-hidden bg-slate-100">
                <img
                  src={staff.image}
                  alt={staff.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-1">{staff.name}</h3>
                <p className="text-primary font-medium text-sm mb-4">{staff.role}</p>
                <p className="text-slate-500 text-sm mb-6 line-clamp-3">
                  {staff.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
