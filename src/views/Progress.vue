<template>
    <div
        class="
            w-screen
            h-screen
            bg-gray-800
            flex flex-col
            items-center
            justify-center
            gap-8
        "
    >
        <p class="text-white text-3xl">
            ${{ Number(progress).toFixed(2) }} / ${{ Number(goal).toFixed(2) }}
        </p>
        <div
            id="container"
            class="
                w-4/5
                bg-kenway-teal-dark
                rounded-full
                h-1/6
                flex
                items-center
                p-6
            "
        >
            <div
                id="bar"
                :style="percentageWidth"
                class="
                    bg-kenway-teal
                    h-full
                    rounded-l-full
                    flex
                    items-center
                    justify-center
                "
            >
                <p class="text-gray-800 text-3xl font-bold">
                    {{ percentage.toFixed(0) }}%
                </p>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onBeforeMount, computed } from 'vue'
export default {
    setup() {
        const refresh = 30000 // in ms (60,000 = 1 minute)
        const participantId = 451384
        const goal = ref(0)
        const progress = ref(0)
        const percentage = computed(() => (progress.value / goal.value) * 100)
        const percentageWidth = computed(
            () => `width: ${percentage.value.toFixed(0)}%;`
        )

        const fetchProgress = () => {
            console.log('Fetching updated donation data...')
            fetch(`https://extra-life.org/api/participants/${participantId}`)
                .then((res) => res.json())
                .then((data) => {
                    console.log(data)
                    goal.value = data.fundraisingGoal
                    progress.value = data.sumDonations
                })
        }

        onBeforeMount(() => {
            fetchProgress()
        })
        setInterval(() => {
            fetchProgress()
        }, refresh)

        return { goal, progress, percentage, percentageWidth }
    },
}
</script>
