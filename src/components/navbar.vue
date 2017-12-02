<template>
    <div class="navbar">
        <canvas id="curveCanvas"></canvas>
    </div>
</template>

<script>

window.onload = function() {
}
export default {

}
</script>

<style lang="scss">
$navH: 60px;

.navbar {
    width: 100%;
    height: $navH;
    background: #24292e;
    #curveCanvas {
        width: 100%;
        height: 100%;
    }
}
</style>
