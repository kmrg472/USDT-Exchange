
import React from 'react';

interface Props {
  number: string;
}

const WhatsAppButton: React.FC<Props> = ({ number }) => {
  const handleClick = () => {
    window.open(`https://wa.me/${number}?text=REQUESTING_PRIVATE_SUPPORT_V5`, '_blank');
  };

  return (
    <button 
      onClick={handleClick}
      className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[9999] group active:scale-90 transition-transform flex items-center gap-4"
      aria-label="Direct Support"
    >
      <div className="bg-white px-5 py-3 rounded-2xl shadow-xl border border-slate-100 text-[10px] font-black text-blue-600 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0 whitespace-nowrap uppercase tracking-[0.2em] hidden md:block">
        Direct Relay
      </div>
      <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-600 rounded-2xl md:rounded-[32px] flex items-center justify-center shadow-2xl shadow-blue-200 hover:scale-110 transition-all transform relative">
        <div className="absolute inset-0 rounded-2xl md:rounded-[32px] bg-blue-600 animate-ping opacity-20"></div>
        <svg className="w-8 h-8 md:w-10 md:h-10 text-white relative z-10" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .004 5.411.002 12.048c0 2.12.54 4.189 1.57 6.052L0 24l6.104-1.602a11.82 11.82 0 005.936 1.57h.005c6.634 0 12.045-5.411 12.048-12.049a11.79 11.79 0 00-3.517-8.417" />
        </svg>
      </div>
    </button>
  );
};

export default WhatsAppButton;
