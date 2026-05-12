import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FloatingWhatsApp() {
  const whatsappNumber = '233257077972';
  const message = encodeURIComponent('Hello SUCCESS THEOLOGICAL SEMINARY AND COLLEGE, I would like to inquire about your programs.');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <div className="fixed bottom-8 right-8 z-[100] animate-in fade-in slide-in-from-bottom-4 duration-500">
      <a 
        href={whatsappUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block group"
      >
        <div className="absolute -top-12 right-0 bg-white text-black text-xs font-bold px-3 py-1.5 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap border border-gray-100">
          Chat with us!
          <div className="absolute -bottom-1 right-4 w-2 h-2 bg-white rotate-45 border-r border-b border-gray-100"></div>
        </div>
        <Button 
          size="icon" 
          className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#128C7E] shadow-[0_8px_25px_-5px_rgba(37,211,102,0.5)] border-none transition-transform hover:scale-110 active:scale-95"
        >
          <MessageCircle className="w-8 h-8 text-white" />
        </Button>
      </a>
    </div>
  );
}
