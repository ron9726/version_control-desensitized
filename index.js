console.log("version-control starting...");
const { app, port } = require("./utils/base");

require("./controller/projectController");
require("./controller/pvController");
require("./controller/versionController");
require("./controller/jiraController");
require("./controller/projectTypeController");

app.listen(port, () => {
  console.log(`version-control started at port:${port}`);
});
