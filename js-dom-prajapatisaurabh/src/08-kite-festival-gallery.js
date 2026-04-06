/**
 * 🪁 Kite Festival Gallery - Dynamic Rendering from Data Arrays
 *
 * Uttarayan / Makar Sankranti ke kite festival ki photo gallery render
 * karna hai data se! Array mein kites ka data hai - naam, color, size,
 * maker, image. Har kite ke liye DOM element banao, gallery mein render
 * karo, filter karo, sort karo. Jaise aasmaaan mein hazaron patang udte
 * hain, waise hi screen pe gallery bhar do.
 *
 * Functions:
 *
 *   1. renderKiteCard(kite)
 *      - Takes { name, color, size, maker, image } object
 *      - Creates div.kite-card containing:
 *        - img with src=image, alt=name
 *        - h3.kite-name with textContent=name
 *        - p.kite-maker with textContent="by {maker}"
 *        - p.kite-info with textContent="{size} - {color}"
 *      - Returns the div element
 *      - Agar kite null/undefined or missing required fields
 *        (name, color, size, maker, image), return null
 *
 *   2. renderGallery(container, kites)
 *      - Clears container's innerHTML (removes all existing children)
 *      - Renders each kite using renderKiteCard
 *      - Appends each card to container
 *      - Skips null results from renderKiteCard (invalid kites)
 *      - Returns number of kites successfully rendered
 *      - Agar container null/undefined, return -1
 *      - Agar kites not array, return -1
 *
 *   3. filterKites(container, kites, filterFn)
 *      - Filters kites array using filterFn (callback that takes kite, returns bool)
 *      - Renders ONLY the filtered kites in container (clears first)
 *      - Returns count of visible (rendered) kites
 *      - Agar container null, return -1
 *      - Agar kites not array or filterFn not function, return -1
 *
 *   4. sortAndRender(container, kites, sortField, order)
 *      - Creates a COPY of kites array (don't modify original)
 *      - Sorts copy by sortField (e.g., "name", "size", "color")
 *      - order: "asc" for ascending, "desc" for descending
 *      - Renders sorted kites in container
 *      - Returns the sorted array copy
 *      - Agar container null, return []
 *      - Agar kites not array, return []
 *      - Default order is "asc" if not provided
 *
 *   5. renderEmptyState(container, message)
 *      - Checks if container has any child elements
 *      - If container is EMPTY (no children): creates p.empty-state with
 *        textContent=message and appends to container. Returns true.
 *      - If container already HAS children: does nothing. Returns false.
 *      - Agar container null/undefined, return false
 *
 * Hint: innerHTML = "" se container khali karo. Array.filter() se filter,
 *   Array.sort() se sort karo. Spread [...array] se copy banao.
 *
 * @example
 *   const kite = {
 *     name: "Patang Raja",
 *     color: "Red",
 *     size: "Large",
 *     maker: "Kite Master Ali",
 *     image: "patang.jpg"
 *   };
 *   const card = renderKiteCard(kite);
 *   // => <div class="kite-card">
 *   //      <img src="patang.jpg" alt="Patang Raja">
 *   //      <h3 class="kite-name">Patang Raja</h3>
 *   //      <p class="kite-maker">by Kite Master Ali</p>
 *   //      <p class="kite-info">Large - Red</p>
 *   //    </div>
 *
 *   renderGallery(container, [kite1, kite2, kite3]);
 *   // => 3 (three kite cards rendered in container)
 *
 *   filterKites(container, kites, k => k.color === "Red");
 *   // => 1 (only red kites shown)
 */
export function renderKiteCard(kite) {
  if (
    !kite ||
    !kite.name ||
    !kite.color ||
    !kite.size ||
    !kite.maker ||
    !kite.image
  ) {
    return null;
  }
  const card = document.createElement("div");
  card.className = "kite-card";

  const img = document.createElement("img");
  img.src = kite.image;
  img.alt = kite.name;

  const nameEl = document.createElement("h3");
  nameEl.className = "kite-name";
  nameEl.textContent = kite.name;

  const makerEl = document.createElement("p");
  makerEl.className = "kite-maker";
  makerEl.textContent = `by ${kite.maker}`;

  const infoEl = document.createElement("p");
  infoEl.className = "kite-info";
  infoEl.textContent = `${kite.size} - ${kite.color}`;

  card.appendChild(img);
  card.appendChild(nameEl);
  card.appendChild(makerEl);
  card.appendChild(infoEl);

  return card;
}

export function renderGallery(container, kites) {
  if (!container || !Array.isArray(kites)) {
    return -1;
  }
  container.innerHTML = "";
  let renderedCount = 0;
  for (const kite of kites) {
    const card = renderKiteCard(kite);
    if (card) {
      container.appendChild(card);
      renderedCount++;
    }
  }
  return renderedCount;
}

export function filterKites(container, kites, filterFn) {
  if (!container || !Array.isArray(kites) || typeof filterFn !== "function") {
    return -1;
  }
  container.innerHTML = "";
  let renderedCount = 0;
  for (const kite of kites) {
    if (filterFn(kite)) {
      const card = renderKiteCard(kite);
      if (card) {
        container.appendChild(card);
        renderedCount++;
      }
    }
  }
  return renderedCount;
}

export function sortAndRender(container, kites, sortField, order) {
  if (!container || !Array.isArray(kites)) {
    return [];
  }
  const sortedKites = [...kites].sort((a, b) => {
    if (order === "desc") {
      return b[sortField] < a[sortField] ? -1 : 1;
    }
    return a[sortField] < b[sortField] ? -1 : 1;
  });
  renderGallery(container, sortedKites);
  return sortedKites;
}

export function renderEmptyState(container, message) {
  if (!container) {
    return false;
  }
  if (container.children.length === 0) {
    const emptyState = document.createElement("p");
    emptyState.className = "empty-state";
    emptyState.textContent = message;
    container.appendChild(emptyState);
    return true;
  }
  return false;
}
