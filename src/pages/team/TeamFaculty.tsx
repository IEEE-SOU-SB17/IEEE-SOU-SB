import { useState, useEffect } from "react";
import { Search, Linkedin } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "@/firebase";

interface Member {
  id: string;
  name: string;
  department: string;
  designation: string;
  image: string;
  linkedin: string;
  type: string;
  founding?: boolean;
  createdAt?: any;
}

export default function TeamFaculty() {
  const [searchTerm, setSearchTerm] = useState("");
  const [facultyMembers, setFacultyMembers] = useState<Member[]>([]);

  useEffect(() => {
    const fetchFacultyMembers = async () => {
      try {
        const membersRef = collection(db, "members");
        const q = query(
          membersRef,
          where("type", "==", "faculty"),
          orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        const data: Member[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Member[];
        setFacultyMembers(data);
      } catch (error) {
        console.error("Error fetching faculty members:", error);
      }
    };

    fetchFacultyMembers();
  }, []);

  const filtered = facultyMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.designation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const foundingMember = filtered.find(member => member.founding);
  const otherMembers = filtered.filter(member => !member.founding);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-24 pb-16 animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Faculty Members</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Meet the faculty guiding IEEE SOU Student Branch.
            </p>
          </div>

          <div className="flex justify-center mb-10">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search faculty..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Founding Member */}
          {foundingMember && (
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-4 text-center">Founding Faculty Member</h2>
              <div className="max-w-4xl mx-auto">
                <div className="bg-white glass rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <div className="flex flex-col md:flex-row items-center p-8">
                    <img
                      src={foundingMember.image}
                      alt={foundingMember.name}
                      className="w-36 h-36 rounded-full object-cover mb-4 md:mb-0 md:mr-6 border-4 border-primary"
                    />
                    <div className="text-center md:text-left">
                      <div className="flex items-center justify-center md:justify-start mb-2">
                        <h3 className="text-2xl font-bold">{foundingMember.name}</h3>
                        <a
                          href={foundingMember.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-primary hover:text-primary/80"
                        >
                          <Linkedin className="h-5 w-5" />
                        </a>
                      </div>
                      <p className="text-base"><strong>Designation:</strong> {foundingMember.designation}</p>
                      <p className="text-base"><strong>Department:</strong> {foundingMember.department}</p>
                      <p className="mt-3 text-sm text-muted-foreground">
                        Founding member of IEEE SOU SB who has laid the strong foundation for our growth and continues to inspire us.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Other Faculty Members */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {otherMembers.map(member => (
              <div
                key={member.id}
                className="bg-white glass rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="p-6 flex flex-col items-center text-center">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full object-cover mb-3 border-2 border-muted"
                  />
                  <div className="flex items-center justify-center mb-1">
                    <h3 className="font-bold text-lg">{member.name}</h3>
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-primary hover:text-primary/80"
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                  </div>
                  <p className="text-sm mb-1"><strong>Designation:</strong> {member.designation}</p>
                  <p className="text-sm text-muted-foreground"><strong>Department:</strong> {member.department}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
