import React from "react";
import ReactDOM from "react-dom";
import Layout from "./components/Layout";

const app = document.getElementById('surface');

/**
 * PMT Task board
 * version 1.5.3
 */

ReactDOM.render(
    <Layout url="../src/models/data.php" version="1.5.6" />,
    app
);