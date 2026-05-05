import { useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function App() {
  const today = new Date();
  const defaultDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const dateStr = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;
  const random4 = Math.floor(1000 + Math.random() * 9000);
  const defaultInvoiceNumber = `INV-${dateStr}-${random4}`;

  const [currency, setCurrency] = useState("IDR");
  const [format, setFormat] = useState("Artistic");
  const [isFormatOpen, setIsFormatOpen] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState(defaultInvoiceNumber);
  const [date, setDate] = useState(defaultDate);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const handleDateSelect = (day: number) => {
    const formattedDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setDate(formattedDate);
    setIsDatePickerOpen(false);
  };
  
  const [fromName, setFromName] = useState("Afuwa Hidayah Mulyo");
  const [fromEmail, setFromEmail] = useState("fuwahm.22@gmail.com");
  const [fromPhone, setFromPhone] = useState("+62 812-5251-2640");
  const [fromAddress, setFromAddress] = useState("Jl. Candi Panggung No.23B, Lowokwaru, Malang, Jawa Timur, Indonesia");
  const [clientName, setClientName] = useState("Acme Corp");
  const [clientEmail, setClientEmail] = useState("billing@acmecorp.com");
  const [clientAddress, setClientAddress] = useState("456 Corporate Blvd\nSan Francisco, CA 94107");
  const [items, setItems] = useState([
    { id: 1, description: "Brand Identity Design", qty: 1, rate: 2500 },
    { id: 2, description: "Web Development", qty: 40, rate: 85 },
  ]);
  const [taxRate, setTaxRate] = useState(0);
  const [notes, setNotes] = useState("Payment is due within 30 days. Thank you for your business!");

  const pdfRef = useRef<HTMLDivElement>(null);

  const handleAddItem = () => {
    setItems([
      ...items,
      { id: Date.now(), description: "", qty: 1, rate: 0 },
    ]);
  };

  const handleRemoveItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleItemChange = (id: number, field: string, value: string | number) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const subtotal = items.reduce((sum, item) => sum + item.qty * item.rate, 0);
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;

  const formatCurrency = (amount: number) => {
    const locale = currency === "IDR" ? "id-ID" : "en-US";
    const formattedNum = new Intl.NumberFormat(locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
    return `${currency} ${formattedNum}`;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-US', options);
  };

  const downloadPDF = async () => {
    const element = pdfRef.current;
    if (!element) return;

    // We can temporarily add a class or adjust styles for PDF generation if needed
    try {
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${invoiceNumber || 'invoice'}.pdf`);
    } catch (error) {
      console.error("Failed to generate PDF", error);
    }
  };

  return (
    <div className="bg-surface font-body-lg text-on-surface text-body-lg overflow-x-hidden min-h-screen flex flex-col lg:flex-row">
      {/* SideNavBar (Desktop) */}
      <nav className="hidden lg:flex flex-col fixed left-0 top-0 h-full z-40 bg-[#F1F1F0] dark:bg-zinc-950 border-r-[2.5px] border-black w-64">
        <div className="p-lg border-b-[2.5px] border-black">
          <h1 className="font-headline-md text-headline-md text-xl font-black text-black dark:text-white uppercase mb-1">Invoice Studio</h1>
          <p className="font-body-md text-body-md text-on-surface-variant font-bold uppercase tracking-widest text-xs">Creator Pro</p>
        </div>
        <div className="p-4 border-b-[2.5px] border-black">
          <button className="w-full bg-primary-container text-black border-[2.5px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-[2px] hover:-translate-x-[2px] transition-all font-label-bold text-label-bold py-3 px-4 flex items-center justify-center gap-2 uppercase tracking-wide">
            <span className="material-symbols-outlined font-bold">add</span>
            New Invoice
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <a className="text-black dark:text-white flex items-center gap-3 p-4 m-2 border-[2.5px] border-transparent hover:border-black hover:bg-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all font-['Space_Grotesk'] font-bold text-sm uppercase" href="#">
            <span className="material-symbols-outlined">edit_document</span>
            Drafts
          </a>
          <a className="text-black dark:text-white flex items-center gap-3 p-4 m-2 border-[2.5px] border-transparent hover:border-black hover:bg-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all font-['Space_Grotesk'] font-bold text-sm uppercase" href="#">
            <span className="material-symbols-outlined">task_alt</span>
            Issued
          </a>
          <a className="text-black dark:text-white flex items-center gap-3 p-4 m-2 border-[2.5px] border-transparent hover:border-black hover:bg-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all font-['Space_Grotesk'] font-bold text-sm uppercase" href="#">
            <span className="material-symbols-outlined">payments</span>
            Paid
          </a>
          <a className="text-black dark:text-white flex items-center gap-3 p-4 m-2 border-[2.5px] border-transparent hover:border-black hover:bg-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all font-['Space_Grotesk'] font-bold text-sm uppercase" href="#">
            <span className="material-symbols-outlined">person</span>
            Clients
          </a>
        </div>
        <div className="p-md border-t-[2.5px] border-black mt-auto flex items-center gap-3 hover:bg-surface-variant cursor-pointer transition-colors">
          <img alt="User Profile" className="w-10 h-10 rounded-full border-2 border-black object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZ4QE-NWxEAfTFsY3TAWjPgAc1daDtsZAbvOJNCaGqgyTPAm1_L2qQUQ2hfM2Ozxz96qj-KCkMBKuJajr3LchiD7jz3qzLaavFdJP7unJoErMwtj5bWcvFnVCyAYH543VRU0qNWr9kGv6H7HrzReq5V8c_oGnZkBdOLGtf8kfnS6R4Rhflh1Ksg7UGB2P7CRjvQwsjCHEEpDY4lvGcThsVyVneC4LjMY3OgzKothsQMpheOVb4w9mOiLibCYurXUxMxNyYs1rTgWhR" />
          <div>
            <p className="font-label-bold text-label-bold text-black">Alex Rivera</p>
            <p className="font-body-md text-body-md text-on-surface-variant text-sm">Settings</p>
          </div>
        </div>
      </nav>

      {/* TopAppBar (Mobile) */}
      <header className="lg:hidden flex justify-between items-center h-20 px-8 w-full bg-white dark:bg-zinc-900 border-b-[2.5px] border-black dark:border-white sticky top-0 z-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <h1 className="text-2xl font-black italic text-black dark:text-white uppercase font-['Space_Grotesk'] tracking-tight">ARMSTRONG INVOICE</h1>
        <div className="flex gap-4">
          <button className="font-['Space_Grotesk'] font-bold uppercase tracking-tight text-black dark:text-white hover:text-[#FF90E8] hover:translate-x-[2px] hover:translate-y-[2px] transition-all">Save Draft</button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 flex flex-col xl:flex-row w-full max-w-[1920px] mx-auto bg-surface-container-low min-h-screen">
        {/* Top App Bar (Desktop inside main content for layout) */}
        <header className="hidden lg:flex justify-between items-center h-20 px-8 w-full bg-white dark:bg-zinc-900 border-b-[2.5px] border-black dark:border-white sticky top-0 z-40 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] col-span-full xl:absolute xl:w-[calc(100%-16rem)]">
          <h2 className="text-2xl font-black italic text-black dark:text-white uppercase font-['Space_Grotesk'] tracking-tight">ARMSTRONG INVOICE</h2>
          <div className="flex gap-6 items-center">
            <button className="font-['Space_Grotesk'] font-bold uppercase tracking-tight text-black dark:text-white hover:text-[#FF90E8] hover:translate-x-[2px] hover:translate-y-[2px] transition-all py-2">Save Draft</button>
          </div>
        </header>

        {/* Left Column: Editor */}
        <section className="flex-1 p-4 md:p-lg lg:p-xl xl:pt-32 border-r-[2.5px] border-black xl:max-w-[40%] flex flex-col gap-lg overflow-y-auto">
          <div className="flex justify-between items-end border-b-[2.5px] border-black pb-4">
            <h2 className="font-headline-lg text-headline-lg text-black uppercase">Edit Invoice</h2>
            <div className="bg-tertiary-container text-black font-label-bold text-label-bold px-4 py-2 border-[2.5px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase tracking-wide">
              Draft
            </div>
          </div>

          {/* Details Section */}
          <div className="bg-white border-[2.5px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-lg flex flex-col gap-md">
            <h3 className="font-headline-md text-headline-md text-black uppercase border-b-[2.5px] border-black pb-2 mb-2">Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
              <div className="flex flex-col gap-2 justify-end h-full">
                <label className="font-label-bold text-label-bold text-black uppercase tracking-wider">Invoice Number</label>
                <input
                  className="bg-[#F1F1F0] border-[2.5px] border-black px-4 py-3 font-body-lg text-body-lg text-black focus:outline-none focus:border-[#FF90E8] focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all w-full"
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2 justify-end h-full">
                <label className="font-label-bold text-label-bold text-black uppercase tracking-wider">Date of Issue</label>
                <div className="relative">
                  <button 
                    type="button"
                    onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                    className="bg-[#F1F1F0] border-[2.5px] border-black px-4 py-3 font-body-lg text-body-lg text-black focus:outline-none focus:border-[#FF90E8] focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all w-full flex justify-between items-center text-left"
                  >
                    <span>{formatDate(date)}</span>
                    <span className="material-symbols-outlined">calendar_today</span>
                  </button>

                  {isDatePickerOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setIsDatePickerOpen(false)}
                      ></div>
                      <div className="absolute z-50 w-[280px] mt-2 bg-white border-[2.5px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col p-4 right-0 md:left-auto">
                        <div className="flex justify-between items-center mb-4">
                          <button 
                            type="button" 
                            onClick={() => {
                              if (currentMonth === 0) {
                                setCurrentMonth(11);
                                setCurrentYear(prev => prev - 1);
                              } else {
                                setCurrentMonth(prev => prev - 1);
                              }
                            }} 
                            className="hover:bg-[#FF90E8] p-1 border-[2.5px] border-transparent hover:border-black transition-all flex items-center justify-center"
                          >
                            <span className="material-symbols-outlined text-sm">chevron_left</span>
                          </button>
                          <div className="font-label-bold text-label-bold text-black uppercase">
                            {monthNames[currentMonth]} {currentYear}
                          </div>
                          <button 
                            type="button" 
                            onClick={() => {
                              if (currentMonth === 11) {
                                setCurrentMonth(0);
                                setCurrentYear(prev => prev + 1);
                              } else {
                                setCurrentMonth(prev => prev + 1);
                              }
                            }} 
                            className="hover:bg-[#FF90E8] p-1 border-[2.5px] border-transparent hover:border-black transition-all flex items-center justify-center"
                          >
                            <span className="material-symbols-outlined text-sm">chevron_right</span>
                          </button>
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center font-label-bold text-label-bold mb-2">
                          {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => <div key={d}>{d}</div>)}
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                            <div key={`empty-${i}`} />
                          ))}
                          {Array.from({ length: daysInMonth }).map((_, i) => {
                            const day = i + 1;
                            const isSelected = date === `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                            return (
                              <button
                                key={day}
                                type="button"
                                onClick={() => handleDateSelect(day)}
                                className={`w-8 h-8 flex items-center justify-center font-body-md text-body-md border-[2.5px] transition-all hover:bg-[#FF90E8] hover:border-black ${isSelected ? 'bg-black text-white border-black' : 'border-transparent text-black'}`}
                              >
                                {day}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2 justify-end h-full">
                <label className="font-label-bold text-label-bold text-black uppercase tracking-wider">Currency</label>
                <div className="relative">
                  <button 
                    type="button"
                    onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                    className="bg-[#F1F1F0] border-[2.5px] border-black px-4 py-3 font-body-lg text-body-lg text-black focus:outline-none focus:border-[#FF90E8] focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all w-full flex justify-between items-center text-left"
                  >
                    <span>{currency}</span>
                    <span className="material-symbols-outlined">expand_more</span>
                  </button>
                  
                  {isCurrencyOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setIsCurrencyOpen(false)}
                      ></div>
                      <div className="absolute z-50 w-full mt-2 bg-white border-[2.5px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col">
                        {["IDR", "USD", "SGD"].map(code => (
                          <button
                            key={code}
                            type="button"
                            className={`px-4 py-3 text-left font-body-lg text-body-lg hover:bg-[#FF90E8] hover:text-black transition-colors border-b-[2.5px] last:border-b-0 border-black ${currency === code ? 'bg-surface-variant font-bold' : 'bg-white'}`}
                            onClick={() => {
                              setCurrency(code);
                              setIsCurrencyOpen(false);
                            }}
                          >
                            {code}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2 justify-end h-full">
                <label className="font-label-bold text-label-bold text-black uppercase tracking-wider">Format</label>
                <div className="relative">
                  <button 
                    type="button"
                    onClick={() => setIsFormatOpen(!isFormatOpen)}
                    className="bg-[#F1F1F0] border-[2.5px] border-black px-4 py-3 font-body-lg text-body-lg text-black focus:outline-none focus:border-[#FF90E8] focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all w-full flex justify-between items-center text-left"
                  >
                    <span>{format}</span>
                    <span className="material-symbols-outlined">expand_more</span>
                  </button>
                  
                  {isFormatOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsFormatOpen(false)}></div>
                      <div className="absolute z-50 w-full mt-2 bg-white border-[2.5px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col">
                        {["Artistic", "Formal"].map(fmt => (
                          <button
                            key={fmt}
                            type="button"
                            className={`px-4 py-3 text-left font-body-lg text-body-lg hover:bg-[#FF90E8] hover:text-black transition-colors border-b-[2.5px] last:border-b-0 border-black ${format === fmt ? 'bg-surface-variant font-bold' : 'bg-white'}`}
                            onClick={() => {
                              setFormat(fmt);
                              setIsFormatOpen(false);
                            }}
                          >
                            {fmt}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Entities Section */}
          <div className="flex flex-col gap-lg">
            {/* Biller */}
            <div className="bg-tertiary-fixed border-[2.5px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-lg flex flex-col gap-md">
              <h3 className="font-headline-md text-headline-md text-black uppercase border-b-[2.5px] border-black pb-2 mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined">storefront</span>
                From
              </h3>
              <div className="flex flex-col gap-4">
                <input
                  className="bg-white border-[2.5px] border-black px-4 py-3 font-body-lg text-body-lg text-black focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all w-full"
                  placeholder="Your Name / Company"
                  type="text"
                  value={fromName}
                  onChange={(e) => setFromName(e.target.value)}
                />
                <input
                  className="bg-white border-[2.5px] border-black px-4 py-3 font-body-lg text-body-lg text-black focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all w-full"
                  placeholder="Email"
                  type="text"
                  value={fromEmail}
                  onChange={(e) => setFromEmail(e.target.value)}
                />
                <input
                  className="bg-white border-[2.5px] border-black px-4 py-3 font-body-lg text-body-lg text-black focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all w-full"
                  placeholder="Phone Number"
                  type="text"
                  value={fromPhone}
                  onChange={(e) => setFromPhone(e.target.value)}
                />
                <textarea
                  className="bg-white border-[2.5px] border-black px-4 py-3 font-body-lg text-body-lg text-black focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all w-full resize-y"
                  placeholder="Address"
                  rows={4}
                  value={fromAddress}
                  onChange={(e) => setFromAddress(e.target.value)}
                />
              </div>
            </div>

            {/* Client */}
            <div className="bg-primary-fixed border-[2.5px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-lg flex flex-col gap-md">
              <h3 className="font-headline-md text-headline-md text-black uppercase border-b-[2.5px] border-black pb-2 mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined">account_circle</span>
                Bill To
              </h3>
              <div className="flex flex-col gap-4">
                <input
                  className="bg-white border-[2.5px] border-black px-4 py-3 font-body-lg text-body-lg text-black focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all w-full"
                  placeholder="Client Name"
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                />
                <input
                  className="bg-white border-[2.5px] border-black px-4 py-3 font-body-lg text-body-lg text-black focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all w-full"
                  placeholder="Client Email"
                  type="text"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                />
                <textarea
                  className="bg-white border-[2.5px] border-black px-4 py-3 font-body-lg text-body-lg text-black focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all w-full resize-y"
                  placeholder="Client Address"
                  rows={4}
                  value={clientAddress}
                  onChange={(e) => setClientAddress(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="bg-white border-[2.5px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-lg flex flex-col gap-md">
            <div className="flex justify-between items-center border-b-[2.5px] border-black pb-2 mb-2">
              <h3 className="font-headline-md text-headline-md text-black uppercase">Line Items</h3>
              <button onClick={handleAddItem} className="bg-black text-white px-4 py-2 border-[2.5px] border-black font-label-bold text-label-bold uppercase tracking-wide hover:bg-[#FF90E8] hover:text-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 transition-all flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">add</span> Add Row
              </button>
            </div>

            <div className="overflow-x-auto">
              <div className="min-w-[550px]">
                {/* Header Row */}
                <div className="grid grid-cols-[2.5fr_1fr_1.5fr_auto] gap-4 mb-4 border-b-[2.5px] border-black pb-2 font-label-bold text-label-bold uppercase tracking-wider text-black">
                  <div>Description</div>
                  <div className="text-right">Qty / Hrs</div>
                  <div className="text-right">Rate (IDR)</div>
                  <div className="w-10"></div>
                </div>

                {/* Item Rows */}
                {items.map((item) => (
                  <div key={item.id} className="grid grid-cols-[2.5fr_1fr_1.5fr_auto] gap-4 items-start mb-4 group">
                    <input
                      className="bg-[#F1F1F0] border-[2.5px] border-black px-3 py-2 font-body-md text-body-md text-black focus:outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-full"
                      type="text"
                      value={item.description}
                      onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                    />
                    <input
                      className="bg-[#F1F1F0] border-[2.5px] border-black px-3 py-2 font-body-md text-body-md text-black text-right focus:outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-full"
                      type="number"
                      value={item.qty}
                      onChange={(e) => handleItemChange(item.id, 'qty', Number(e.target.value))}
                    />
                    <input
                      className="bg-[#F1F1F0] border-[2.5px] border-black px-3 py-2 font-body-md text-body-md text-black text-right focus:outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-full"
                      type="number"
                      value={item.rate}
                      onChange={(e) => handleItemChange(item.id, 'rate', Number(e.target.value))}
                    />
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-2 border-[2.5px] border-transparent hover:border-black hover:bg-[#ffdad6] text-black transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 self-stretch"
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t-[2.5px] border-black mt-4 pt-4 flex justify-end">
              <div className="w-full flex flex-col gap-2">
                <div className="flex justify-between font-body-lg text-body-lg">
                  <span>Subtotal</span>
                  <span className="font-bold">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between font-body-lg text-body-lg items-center">
                  <span>Tax (%)</span>
                  <input
                    className="w-20 bg-[#F1F1F0] border-[2.5px] border-black px-2 py-1 text-right focus:outline-none focus:bg-white focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    type="number"
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                  />
                </div>
                <div className="flex justify-between font-headline-md text-headline-md text-black uppercase mt-4 pt-4 border-t-[2.5px] border-black">
                  <span>Total</span>
                  <span className="whitespace-nowrap">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white border-[2.5px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-lg flex flex-col gap-md mb-xl xl:mb-0">
            <h3 className="font-headline-md text-headline-md text-black uppercase border-b-[2.5px] border-black pb-2 mb-2">Notes / Terms</h3>
            <textarea
              className="bg-[#F1F1F0] border-[2.5px] border-black px-4 py-3 font-body-lg text-body-lg text-black focus:outline-none focus:border-[#FF90E8] focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all w-full resize-y"
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </section>

        {/* Right Column: Live Preview */}
        <section className="flex-1 p-4 md:p-lg lg:p-xl xl:pt-32 bg-surface-variant relative flex justify-center">
          <div className="sticky top-32 w-full max-w-[800px] h-fit">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-label-bold text-label-bold text-black uppercase tracking-widest flex items-center gap-2">
                <span className="material-symbols-outlined">visibility</span> Live Preview
              </h2>
            </div>

            {/* A4 Document Container */}
            {format === "Artistic" ? (
              <div ref={pdfRef} className="bg-white border-[4px] border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] w-full aspect-[1/1.414] p-8 md:p-12 flex flex-col relative overflow-hidden group">
              {/* Decorative Graphic */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-container rounded-full border-[4px] border-black opacity-50 pointer-events-none"></div>

              {/* Header */}
              <div className="flex justify-between items-start border-b-[4px] border-black pb-8 mb-8 relative z-10">
                <div>
                  <h1 className="font-display-xl text-display-xl text-black uppercase leading-none mb-4">INVOICE</h1>
                  <p className="font-label-bold text-label-bold text-black text-lg bg-tertiary-fixed border-[2.5px] border-black inline-block px-3 py-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">#{invoiceNumber || 'INV-000'}</p>
                </div>
                <div className="text-right max-w-xs">
                  <h2 className="font-headline-md text-headline-md text-black mb-1">{fromName || 'Your Company'}</h2>
                  <p className="font-body-md text-body-md text-black whitespace-pre-wrap">{fromAddress}</p>
                  <p className="font-body-md text-body-md text-black">{fromEmail}</p>
                  <p className="font-body-md text-body-md text-black">{fromPhone}</p>
                </div>
              </div>

              {/* Entities */}
              <div className="grid grid-cols-2 gap-8 mb-12">
                <div className="border-[2.5px] border-black p-4 bg-surface-container-low relative">
                  <div className="absolute -top-3 left-4 bg-white border-[2.5px] border-black px-2 font-label-bold text-label-bold uppercase text-xs tracking-wider">Bill To</div>
                  <h3 className="font-headline-md text-headline-md text-black text-2xl mb-2">{clientName || 'Client Name'}</h3>
                  <p className="font-body-md text-body-md text-black whitespace-pre-wrap">{clientAddress}</p>
                  <p className="font-body-md text-body-md text-black">{clientEmail}</p>
                </div>
                <div className="flex flex-col justify-end text-right">
                  <p className="font-label-bold text-label-bold text-black uppercase tracking-wider mb-1">Date Issued</p>
                  <p className="font-headline-md text-headline-md text-black text-xl">{formatDate(date)}</p>
                </div>
              </div>

              {/* Line Items Table (Preview) */}
              <div className="flex-1">
                <table className="w-full text-left border-collapse border-[2.5px] border-black">
                  <thead>
                    <tr className="bg-black text-white font-label-bold text-label-bold uppercase tracking-wider">
                      <th className="p-3 border-[2.5px] border-black">Description</th>
                      <th className="p-3 border-[2.5px] border-black text-right">Qty</th>
                      <th className="p-3 border-[2.5px] border-black text-right whitespace-nowrap">Rate</th>
                      <th className="p-3 border-[2.5px] border-black text-right whitespace-nowrap">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="font-body-md text-body-md text-black">
                    {items.map((item, index) => (
                      <tr key={index} className={index % 2 !== 0 ? "bg-surface-container-low" : ""}>
                        <td className="p-3 border-[2.5px] border-black font-bold">{item.description}</td>
                        <td className="p-3 border-[2.5px] border-black text-right">{item.qty}</td>
                        <td className="p-3 border-[2.5px] border-black text-right whitespace-nowrap">{formatCurrency(item.rate)}</td>
                        <td className="p-3 border-[2.5px] border-black text-right font-bold whitespace-nowrap">{formatCurrency(item.qty * item.rate)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="flex justify-end mt-8 border-t-[4px] border-black pt-8">
                <div className="w-full md:w-2/3 lg:w-3/5">
                  <div className="flex justify-between font-body-lg text-body-lg mb-2">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  {taxRate > 0 && (
                    <div className="flex justify-between font-body-lg text-body-lg mb-2">
                      <span>Tax ({taxRate}%)</span>
                      <span>{formatCurrency(taxAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-headline-md text-headline-md text-black uppercase mt-4 bg-primary-fixed border-[4px] border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] -mr-4 transform rotate-1">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>

              {/* Footer Notes */}
              <div className="mt-auto pt-8">
                <p className="font-label-bold text-label-bold text-black uppercase text-xs tracking-wider mb-2">Notes</p>
                <p className="font-body-md text-body-md text-black italic">{notes}</p>
              </div>
              </div>
            ) : (
              <div ref={pdfRef} className="bg-white w-full aspect-[1/1.414] p-12 flex flex-col relative font-sans text-gray-800 shadow-lg border border-gray-200">
                <div className="flex justify-between items-start border-b border-gray-300 pb-8 mb-8">
                  <div>
                    <h1 className="text-4xl font-light text-gray-900 tracking-wider uppercase mb-2">Invoice</h1>
                    <p className="text-gray-500 font-medium tracking-wide">#{invoiceNumber || 'INV-000'}</p>
                  </div>
                  <div className="text-right max-w-xs text-sm">
                    <h2 className="font-semibold text-gray-900 text-base mb-1">{fromName || 'Your Company'}</h2>
                    <p className="whitespace-pre-wrap text-gray-600 mb-1">{fromAddress}</p>
                    <p className="text-gray-600">{fromEmail}</p>
                    <p className="text-gray-600">{fromPhone}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-12">
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Bill To</h3>
                    <div className="text-sm text-gray-800">
                      <p className="font-semibold text-base text-gray-900 mb-1">{clientName || 'Client Name'}</p>
                      <p className="whitespace-pre-wrap text-gray-600 mb-1">{clientAddress || 'Client Address'}</p>
                      <p className="text-gray-600">{clientEmail || 'Client Email'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Date of Issue</h3>
                    <p className="text-sm font-semibold text-gray-900">{formatDate(date)}</p>
                  </div>
                </div>

                <div className="mb-12">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b-2 border-gray-800 text-xs text-gray-500 uppercase tracking-wider">
                        <th className="py-3 font-semibold">Description</th>
                        <th className="py-3 font-semibold text-right">Qty</th>
                        <th className="py-3 font-semibold text-right">Rate</th>
                        <th className="py-3 font-semibold text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {items.map((item, index) => (
                        <tr key={index} className="border-b border-gray-200">
                          <td className="py-4 text-gray-900">{item.description}</td>
                          <td className="py-4 text-gray-600 text-right">{item.qty}</td>
                          <td className="py-4 text-gray-600 text-right whitespace-nowrap">{formatCurrency(item.rate)}</td>
                          <td className="py-4 text-gray-900 text-right font-semibold whitespace-nowrap">{formatCurrency(item.qty * item.rate)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end pt-4">
                  <div className="w-full md:w-2/3 lg:w-1/2">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Subtotal</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    {taxRate > 0 && (
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Tax ({taxRate}%)</span>
                        <span>{formatCurrency(taxAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold text-gray-900 mt-4 border-t border-gray-300 pt-4">
                      <span>Total</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                  </div>
                </div>

                {notes && (
                  <div className="mt-auto pt-8">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Notes</h3>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{notes}</p>
                  </div>
                )}
              </div>
            )}

            {/* Download Action */}
            <div className="mt-8 flex justify-center">
              <button
                onClick={downloadPDF}
                className="bg-[#FF90E8] text-black border-[4px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 active:shadow-none active:translate-y-2 active:translate-x-2 transition-all font-headline-md text-headline-md uppercase px-12 py-4 flex items-center gap-4 cursor-pointer"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '22px', fontVariationSettings: "'FILL' 1" }}>download</span>
                Download PDF
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
