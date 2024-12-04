import React, { useState } from 'react';

const faqData = [
  { question: 'Apa itu TypeScript?', answer: 'TypeScript adalah bahasa pemrograman yang dikembangkan oleh Microsoft sebagai superset dari JavaScript.' },
  { question: 'Bagaimana cara menginstal React?', answer: 'Anda dapat menginstal React dengan menggunakan perintah `npm install react react-dom`.' },
  { question: 'Apa perbedaan antara let dan const?', answer: 'let digunakan untuk variabel yang nilainya dapat berubah, sedangkan const untuk variabel yang nilainya tetap.' },
];

const History: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full font-poppins">
      <h1 className="text-2xl font-bold mb-6 text-primary">History</h1>
      <div className="space-y-4">
        {faqData.map((item, index) => (
          <div key={index} className="shadow-md rounded-lg overflow-hidden border border-primary bg-white/70 backdrop-blur-md">
            <button
              onClick={() => handleToggle(index)}
              className="w-full text-left py-4 px-6 hover:bg-primary/20 transition-colors font-semibold focus:outline-none"
            >
              {item.question}
            </button>
            {openIndex === index && (
              <div className="px-6 py-4 bg-primary/10 border-t border-primary">
                <p>{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
