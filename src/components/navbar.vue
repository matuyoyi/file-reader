<template>
    <div class="navbar">
        <canvas id="curveCanvas"></canvas>
    </div>
</template>


<script>
import curvejs from 'curvejs'

window.onload = function() {
    var Stage = curvejs.Stage,
    Curve = curvejs.Curve,
    canvas = document.getElementById('curveCanvas'),
    stage = new Stage(canvas),
    rd = function() {
        return -2 + Math.random() * 2
    }

    var curve = new Curve({
        points: [277, 327, 230, 314, 236, 326, 257, 326],
        data: {angle: 0, r:5 ,step:Math.PI / 50 },
        motion: curvejs.motion.dance
    })

    stage.add(curve)

    function tick(){
        stage.update()
        requestAnimationFrame(tick)
    }

    tick()
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
