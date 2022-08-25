/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function () {
  // Define template paths to load
  const templatePaths = [
    "systems/infinite-revolution/templates/actor/partials/item-table-weapons.html",
    "systems/infinite-revolution/templates/actor/partials/item-table-powers.html",
  ];

  // Load the template parts
  return loadTemplates(templatePaths);
};
