import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function generateOrderPDF({ customer, cart }: any) {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("Simões Atacado", 14, 15);

  doc.setFontSize(10);
  doc.text(`Cliente: ${customer.name}`, 14, 25);
  doc.text(`Telefone: ${customer.phone || "Não informado"}`, 14, 31);
  doc.text(`Gerado em: ${new Date().toLocaleString("pt-BR")}`, 14, 37);

  autoTable(doc, {
    startY: 45,
    head: [["Código", "Produto", "Categoria", "Qtd", "Unitário", "Total"]],
    body: cart.map((item: any) => [
      item.productCode || "",
      item.name,
      item.category || "",
      item.quantity,
      `R$ ${Number(item.unitPrice).toFixed(2)}`,
      `R$ ${Number(item.subtotal).toFixed(2)}`,
    ]),
  });

  const total = cart.reduce(
    (acc: number, item: any) => acc + Number(item.subtotal || 0),
    0,
  );

  doc.text(
    `Total: R$ ${total.toFixed(2)}`,
    14,
    (doc as any).lastAutoTable.finalY + 12,
  );

  const pdfBlob = doc.output("blob");

  const file = new File([pdfBlob], "pedido.pdf", {
    type: "application/pdf",
  });

  return file;
}
