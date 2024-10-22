export function hoverTable() {
  const table = document.querySelector(".c_list-wrap");
  const rows = table.querySelectorAll(".c_row-wrap, .c_bottom-row-inner");

  document.querySelectorAll(".cell").forEach((cell) => {
    cell.addEventListener("mouseover", function () {
      const rowWrap = this.parentNode; // Get the row that contains the hovered cell
      const cellIndex = Array.from(rowWrap.children).indexOf(this); // Get the index of the hovered cell within the row
      // Highlight all cells in the same column within the same row

      rows.forEach((row) => {
        row.querySelectorAll(".c_first-cell, .c_cell, .c_cell-impact, .c_description").forEach((cell, index) => {
          if (index % rowWrap.children.length === cellIndex) {
            cell.classList.add("highlight");
          }
        });
      });
    });

    cell.addEventListener("mouseout", function () {
      table.querySelectorAll(".c_cell, .c_cell-impact").forEach((cell) => {
        cell.classList.remove("highlight"); // Remove highlight on mouseout
      });
    });
  });
}
