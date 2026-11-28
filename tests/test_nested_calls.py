from sloperator.runner import run_source


def test_call_result_can_be_used_directly_as_an_argument():
    source = """clanker double(value) {
    ship value * 2✨
}
clanker increment(value) {
    ship value + 1✨
}
hallucinate(increment(double(20)))✨"""

    result = run_source(source)

    assert result.exit_code == 0, result.stderr
    assert result.stderr == ""
    assert result.stdout == "41\n"
